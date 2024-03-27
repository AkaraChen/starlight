import { Plugin } from '@starlight-app/plugin-sdk'
import { IocContext } from 'power-di'
import {
  ITranformedCommand,
  ITransformedPlugin,
  ITransformedView,
  transformPlugin
} from './transform'
import EventEmitter from 'events'
import { StarLightEvent } from '../../constants/event'
import { Observable, fromEvent, merge } from 'rxjs'

export class PluginManager extends EventEmitter {
  context = new IocContext()

  plugins: ITransformedPlugin[] = []
  commands: ITranformedCommand[] = []
  views: ITransformedView[] = []

  eventNames(): StarLightEvent[] {
    return [StarLightEvent.PLUGIN_REGISTER, StarLightEvent.PLUGIN_UNREGISTER]
  }

  observable = merge(...this.eventNames().map((event) => fromEvent(this, event))) as Observable<StarLightEvent>

  resister(plugin: Plugin): void {
    if (this.context.has(plugin.metaData.name)) {
      throw new Error(`Plugin with name ${plugin.metaData.name} already exists`)
    }
    const transformed = transformPlugin(plugin)
    if (transformed.commands) {
      this.commands.push(...transformed.commands)
    }
    if (transformed.views) {
      this.views.push(...transformed.views)
    }
    this.plugins.push(transformed)
    this.context.register(plugin, plugin.metaData.name, {
      singleton: true
    })
    const instance = this.context.get(Plugin)
    instance.lifecycle?.activate?.()
    this.emit(StarLightEvent.PLUGIN_REGISTER)
  }

  unregister(plugin: Plugin): void {
    const instance = this.context.get(Plugin)
    instance.lifecycle?.deactivate?.()
    this.context.remove(plugin.metaData.name)
    this.plugins = this.plugins.filter((p) => p.id !== plugin.metaData.name)
    this.commands = this.commands.filter((c) => c.pluginId !== plugin.metaData.name)
    this.views = this.views.filter((v) => v.pluginId !== plugin.metaData.name)
    this.emit(StarLightEvent.PLUGIN_UNREGISTER)
  }

  getById<T>(id: string): T {
    return this.context.get(id)
  }

  getByType<T>(type: new () => T): T {
    return this.context.get(type)
  }

  // for singleton

  static instance: PluginManager

  static getInstance(): PluginManager {
    if (!this.instance) {
      throw new Error('PluginManager is not initialized')
    }
    return this.instance
  }

  static init(): void {
    this.instance = new PluginManager()
  }
}
