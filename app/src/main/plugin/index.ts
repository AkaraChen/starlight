import { IPlugin, MaybeObservable } from '@starlight-app/plugin-sdk'
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

  handleArrayOrObservable<T extends ITranformedCommand | ITransformedView>(
    transformed: ITransformedPlugin,
    arrayOrObservable: MaybeObservable<T[]>,
    subject: BehaviorSubject<T[]>,
    subscribeMap: Map<string, Subscription>
  ) {
    if (Array.isArray(arrayOrObservable)) {
      subject.next([...subject.value, ...arrayOrObservable])
    } else {
      debug('subscribe', transformed.id)
      const sub = subject.subscribe((items) => {
        subject.next([
          ...items,
          ...subject.value.filter((item) => item.pluginId !== transformed.id)
        ])
      })
      subscribeMap.set(transformed.id, sub)
    }
  }

  resister(plugin: IPlugin): void {
    debug('register plugin', plugin.metaData.name)
    const transformed = transformPlugin(plugin)
    if (transformed.supported()) {
      debug('plugin not supported', plugin.metaData.name)
      return
    }
    if (transformed.commands) {
      this.handleArrayOrObservable<ITranformedCommand>(
        transformed,
        transformed.commands,
        this.commands,
        this.commandSubcribeMap
      )
    }
    if (transformed.views) {
      this.handleArrayOrObservable<ITransformedView>(
        transformed,
        transformed.views,
        this.views,
        this.viewsSubcribeMap
      )
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
