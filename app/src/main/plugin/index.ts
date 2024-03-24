import { Plugin } from '@starlight-app/plugin-sdk'
import { IocContext } from 'power-di'

const context = new IocContext()

export class PluginManager {
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
    context.register(plugin, plugin.metaData.name, {
      singleton: true
    })
    const instance = context.get(Plugin)
    this.callWithErrorHandling(plugin, () => instance.lifecycle?.activate?.())
  }

  unregister(plugin: Plugin): void {
    const instance = context.get(Plugin)
    this.callWithErrorHandling(plugin, () => instance.lifecycle?.deactivate?.())
    context.remove(plugin.metaData.name)
  }
}
