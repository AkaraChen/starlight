import { IPlugin } from '@starlight-app/plugin-sdk'
import {
  ITranformedCommand,
  ITransformedPlugin,
  ITransformedView,
  transformPlugin
} from '@starlight/plugin-utils'
import EventEmitter from 'events'
import { StarLightEvent } from '../../constants/event'
import { BehaviorSubject, Observable, Subscription, fromEvent, merge } from 'rxjs'
import { buildInPlugins } from './load'
import createDebug from 'debug'

const debug = createDebug('starlight:plugin-manager')

export class PluginManager extends EventEmitter {
  plugins: ITransformedPlugin[] = []
  commands = new BehaviorSubject<ITranformedCommand[]>([])
  views = new BehaviorSubject<ITransformedView[]>([])

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

  commandSubcribeMap = new Map<string, Subscription>()
  viewsSubcribeMap = new Map<string, Subscription>()

  resister(plugin: IPlugin): void {
    debug('register plugin', plugin.metaData.name)
    const transformed = transformPlugin(plugin)
    if (transformed.supported()) {
      debug('plugin not supported', plugin.metaData.name)
      return
    }
    if (transformed.commands) {
      if (Array.isArray(transformed.commands)) {
        this.commands.next([...this.commands.value, ...transformed.commands])
      } else {
        debug('subscribe commands', transformed.id)
        const sub = this.commands.subscribe((commands) => {
          this.commands.next([
            ...commands,
            ...this.commands.value.filter((c) => c.pluginId !== transformed.id)
          ])
        })
        this.commandSubcribeMap.set(transformed.id, sub)
      }
    }
    if (transformed.views) {
      if (Array.isArray(transformed.views)) {
        this.views.next([...this.views.value, ...transformed.views])
      } else {
        debug('subscribe views', transformed.id)
        const sub = this.views.subscribe((views) => {
          this.views.next([
            ...views,
            ...this.views.value.filter((v) => v.pluginId !== transformed.id)
          ])
        })
        this.viewsSubcribeMap.set(transformed.id, sub)
      }
    }
    this.plugins.push(transformed)
    plugin.lifecycle?.activate?.()
    this.emit(StarLightEvent.PLUGIN_REGISTER)
  }

  unregister(plugin: IPlugin): void {
    debug('unregister plugin', plugin.metaData.name)
    plugin.lifecycle?.deactivate?.()
    this.plugins = this.plugins.filter((p) => p.id !== plugin.metaData.name)

    this.commands.next(this.commands.value.filter((c) => c.pluginId !== plugin.metaData.name))
    this.commandSubcribeMap.get(plugin.metaData.name)?.unsubscribe()

    this.views.next(this.views.value.filter((v) => v.pluginId !== plugin.metaData.name))
    this.viewsSubcribeMap.get(plugin.metaData.name)?.unsubscribe()

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
