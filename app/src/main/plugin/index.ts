import { Plugin } from '@starlight-app/plugin-sdk'
import { IocContext } from 'power-di'

export class PluginManager {
  context = new IocContext()

  callWithErrorHandling(plugin: Plugin, callback: () => void): void {
    try {
      callback()
    } catch (error) {
      if (plugin.lifecycle?.error && error instanceof Error) {
        plugin.lifecycle.error(error)
      }
    }
  }

  resister(plugin: Plugin): void {
    this.context.register(plugin, plugin.metaData.name, {
      singleton: true
    })
    const instance = this.context.get(Plugin)
    this.callWithErrorHandling(plugin, () => instance.lifecycle?.activate?.())
  }

  unregister(plugin: Plugin): void {
    const instance = this.context.get(Plugin)
    this.callWithErrorHandling(plugin, () => instance.lifecycle?.deactivate?.())
    this.context.remove(plugin.metaData.name)
  }

  getById<T>(id: string): T {
    return this.context.get(id)
  }

  getByType<T>(type: new () => T): T {
    return this.context.get(type)
  }
}
