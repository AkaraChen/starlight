import { IPlugin, MaybeObservable } from '@starlight-app/plugin-sdk'
import {
  ICommandDto,
  ITranformedCommand,
  ITransformedPlugin,
  ITransformedView,
  getICommandDto,
  transformPlugin
} from '@starlight/plugin-utils'
import { IpcRequestEventName, ServerEvent } from '../../constants/ipc'
import { BehaviorSubject, Subscription } from 'rxjs'
import { buildInPlugins } from './load'
import createDebug from 'debug'
import { answerEvent, sendEvent } from '../ipc'

const debug = createDebug('starlight:plugin-manager')

export class PluginManager {
  plugins: ITransformedPlugin[] = []
  commands = new BehaviorSubject<ITranformedCommand[]>([])
  views = new BehaviorSubject<ITransformedView[]>([])

  constructor() {
    this.loadBuildIn()
  }

  commandSubcribeMap = new Map<string, Subscription>()
  viewsSubcribeMap = new Map<string, Subscription>()

  handleArrayOrObservable<T extends ITranformedCommand | ITransformedView>(
    transformed: ITransformedPlugin,
    arrayOrObservable: MaybeObservable<T[]>,
    subject: BehaviorSubject<T[]>,
    subscribeMap: Map<string, Subscription>,
    type: 'command' | 'view'
  ) {
    const event = type === 'command' ? ServerEvent.COMMAND_UPDATE : ServerEvent.VIEW_UPDATE
    if (Array.isArray(arrayOrObservable)) {
      subject.next([...subject.value, ...arrayOrObservable])
      sendEvent(event)
    } else {
      debug('subscribe', transformed.id)
      const sub = arrayOrObservable.subscribe((items) => {
        subject.next([
          ...items,
          ...subject.value.filter((item) => item.pluginId !== transformed.id)
        ])
        sendEvent(event)
      })
      subscribeMap.set(transformed.id, sub)
    }
  }

  resister(plugin: IPlugin): void {
    debug('register plugin', plugin.metaData.name)
    const transformed = transformPlugin(plugin)
    if (!transformed.metaData.support) {
      debug('plugin not supported', plugin.metaData.name, transformed.metaData.support)
      return
    }
    if (transformed.commands) {
      this.handleArrayOrObservable<ITranformedCommand>(
        transformed,
        transformed.commands,
        this.commands,
        this.commandSubcribeMap,
        'command'
      )
    }
    if (transformed.views) {
      this.handleArrayOrObservable<ITransformedView>(
        transformed,
        transformed.views,
        this.views,
        this.viewsSubcribeMap,
        'view'
      )
    }
    this.plugins.push(transformed)
    transformed.lifecycle?.activate?.()
    debug('plugin registered', plugin.metaData.name)
    sendEvent(ServerEvent.PLUGIN_REGISTER)
  }

  unregister(plugin: IPlugin): void {
    debug('unregister plugin', plugin.metaData.name)
    const transformed = this.plugins.find((p) => p.metaData.name === plugin.metaData.name)
    if (!transformed) {
      debug('plugin not found', plugin.metaData.name)
      return
    }
    transformed.lifecycle?.deactivate?.()
    this.plugins = this.plugins.filter((p) => p.id !== plugin.metaData.name)

    this.commands.next(this.commands.value.filter((c) => c.pluginId !== plugin.metaData.name))
    this.commandSubcribeMap.get(plugin.metaData.name)?.unsubscribe()

    this.views.next(this.views.value.filter((v) => v.pluginId !== plugin.metaData.name))
    this.viewsSubcribeMap.get(plugin.metaData.name)?.unsubscribe()

    debug('plugin unregistered', plugin.metaData.name)
    sendEvent(ServerEvent.PLUGIN_REGISTER)
  }

  loadBuildIn() {
    debug('load build-in plugins')
    buildInPlugins.forEach((plugin) => this.resister(plugin))
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

    answerEvent(IpcRequestEventName.GET_COMMANDS, () => {
      return this.instance.commands.value.map(getICommandDto) as ICommandDto[]
    })

    answerEvent(IpcRequestEventName.GET_VIEWS, () => {
      return this.instance.views.value
    })

    answerEvent(IpcRequestEventName.EXECUTE_COMMAND, (payload) => {
      const [pluginId, commandId] = payload
      debug('execute command', pluginId, commandId)
      const command = this.instance.commands.value.find(
        (c) => c.pluginId === pluginId && c.id === commandId
      )
      if (!command) {
        debug('command not found', pluginId, commandId)
        return
      }
      command.handler()
    })
  }
}
