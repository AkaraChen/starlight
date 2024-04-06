import type { IPlugin } from '@starlight-app/plugin-sdk'
import {
  type ICommandDto,
  type ITranformedCommand,
  type ITransformedPlugin,
  type ITransformedView,
  getICommandDto,
  transformPlugin,
} from '@starlight-app/plugin-utils'
import createDebug from 'debug'
import { BehaviorSubject, type Subscription, debounceTime, map } from 'rxjs'
import { IpcRequestEventName, ServerEvent } from '../../shared/ipc'
import { answerEvent, sendEvent } from '../ipc'
import { buildInPlugins } from './load'

const debug = createDebug('starlight:plugin-manager')

class SubscriptionManager {
  private map = new Map<string, Subscription>()

  add(key: string, sub: Subscription) {
    this.map.set(key, sub)
  }

  remove(key: string) {
    const sub = this.map.get(key)
    if (sub) {
      sub.unsubscribe()
    }
    this.map.delete(key)
  }

  dispose() {
    const array = [...this.map.values()]
    for (const sub of array) sub.unsubscribe()
  }
}

export class PluginManager {
  plugins: ITransformedPlugin[] = []
  commands = new BehaviorSubject<ITranformedCommand[]>([])
  views: ITransformedView[] = []

  constructor() {
    this.loadBuildInPlugin()
  }

  subManager = new SubscriptionManager()

  resister(plugin: IPlugin): void {
    debug('register plugin', plugin.metaData.name)
    const transformed = transformPlugin(plugin)
    if (!transformed.metaData.support) {
      debug('plugin not supported', plugin.metaData.name)
      return
    }
    if (transformed.commands) {
      if (Array.isArray(transformed.commands)) {
        this.commands.next([...this.commands.value, ...transformed.commands])
        sendEvent(ServerEvent.COMMAND_UPDATE)
      } else {
        this.subManager.add(
          transformed.id,
          transformed.commands
            .pipe(
              debounceTime(500),
              map((commands) => commands.flat()),
            )
            .subscribe((commands) => {
              this.commands.next([
                ...this.commands.value.filter(
                  (c) => c.pluginId !== transformed.id,
                ),
                ...commands,
              ])
              sendEvent(ServerEvent.COMMAND_UPDATE)
            }),
        )
      }
    }
    if (transformed.views) {
      this.views.push(...transformed.views)
    }
    this.plugins.push(transformed)
    transformed.lifecycle?.activate?.()
    debug('plugin registered', plugin.metaData.name)
    sendEvent(ServerEvent.PLUGIN_REGISTER)
  }

  unregister(plugin: IPlugin): void {
    debug('unregister plugin', plugin.metaData.name)
    const transformed = this.plugins.find(
      (p) => p.metaData.name === plugin.metaData.name,
    )
    if (!transformed) {
      debug('plugin not found', plugin.metaData.name)
      return
    }
    transformed.lifecycle?.deactivate?.()
    this.plugins = this.plugins.filter((p) => p.id !== plugin.metaData.name)

    this.commands.next(
      this.commands.value.filter((c) => c.pluginId !== plugin.metaData.name),
    )
    this.subManager.remove(plugin.metaData.name)

    this.views = this.views.filter((v) => v.pluginId !== plugin.metaData.name)

    debug('plugin unregistered', plugin.metaData.name)
    sendEvent(ServerEvent.PLUGIN_REGISTER)
  }

  loadBuildInPlugin() {
    debug('load build-in plugins')
    for (const plugin of buildInPlugins) this.resister(plugin)
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
    this.listen()
  }

  static listen(): void {
    answerEvent(IpcRequestEventName.GET_COMMANDS, () => {
      return this.instance.commands.value.map(getICommandDto) as ICommandDto[]
    })

    answerEvent(IpcRequestEventName.GET_VIEWS, () => {
      return this.instance.views
    })

    answerEvent(IpcRequestEventName.EXECUTE_COMMAND, (payload) => {
      const [pluginId, commandId] = payload
      debug('execute command', pluginId, commandId)
      const command = this.instance.commands.value.find(
        (c) => c.pluginId === pluginId && c.id === commandId,
      )
      if (!command) {
        debug('command not found', pluginId, commandId)
        return
      }
      command.handler()
    })
  }

  static onFocus() {
    for (const p of this.instance.plugins) p.lifecycle?.focus?.()
  }

  static onClose() {
    this.instance.subManager.dispose()
    for (const p of this.instance.plugins) {
      this.instance.unregister(p)
    }
  }
}
