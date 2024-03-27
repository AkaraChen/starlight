import { IPlugin } from '@starlight-app/plugin-sdk'
import {
  ITranformedCommand,
  ITransformedPlugin,
  ITransformedView,
  transformPlugin
} from '@starlight/plugin-utils'
import EventEmitter from 'events'
import { StarLightEvent } from '../../constants/event'
import { Observable, fromEvent, merge } from 'rxjs'
import { buildInPlugins } from './load'
import createDebug from 'debug'

const debug = createDebug('starlight:plugin-manager')

export class PluginManager extends EventEmitter {
  plugins: ITransformedPlugin[] = []
  commands: ITranformedCommand[] = []
  views: ITransformedView[] = []

  constructor() {
    super()
    this.loadBuildIn()
  }

  eventNames(): StarLightEvent[] {
    return [StarLightEvent.PLUGIN_REGISTER, StarLightEvent.PLUGIN_UNREGISTER]
  }

  observable = merge(
    ...this.eventNames().map((event) => fromEvent(this, event))
  ) as Observable<StarLightEvent>

  resister(plugin: IPlugin): void {
    debug('register plugin', plugin.metaData.name)
    const transformed = transformPlugin(plugin)
    if (transformed.supported()) {
      debug('plugin not supported', plugin.metaData.name)
      return
    }
    if (transformed.commands) {
      this.commands.push(...transformed.commands)
    }
    if (transformed.views) {
      this.views.push(...transformed.views)
    }
    this.plugins.push(transformed)
    plugin.lifecycle?.activate?.()
    this.emit(StarLightEvent.PLUGIN_REGISTER)
  }

  unregister(plugin: IPlugin): void {
    debug('unregister plugin', plugin.metaData.name)
    plugin.lifecycle?.deactivate?.()
    this.plugins = this.plugins.filter((p) => p.id !== plugin.metaData.name)
    this.commands = this.commands.filter((c) => c.pluginId !== plugin.metaData.name)
    this.views = this.views.filter((v) => v.pluginId !== plugin.metaData.name)
    debug('plugin unregistered', plugin.metaData.name)
    this.emit(StarLightEvent.PLUGIN_UNREGISTER)
  }

  loadBuildIn() {
    debug('load build-in plugins')
    buildInPlugins.forEach((plugin) => {
      this.resister(plugin)
    })
  }

  // for singleton

  static instance: PluginManager

  static getInstance(): PluginManager {
    if (!this.instance) {
      debug('PluginManager is not initialized')
      throw new Error('PluginManager is not initialized')
    }
    return this.instance
  }

  static init(): void {
    debug('init PluginManager')
    this.instance = new PluginManager()
  }
}
