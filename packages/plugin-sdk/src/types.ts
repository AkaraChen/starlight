/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPluginMetaData {
  name: string
  version: string
  description: string
}

export type LifecycleCallback = () => void | Promise<void>

export interface ILifecycle {
  onInstall: LifecycleCallback
  onUninstall: LifecycleCallback
  onInit: LifecycleCallback
  onEnable: LifecycleCallback
  onDisable: LifecycleCallback
  onReload: LifecycleCallback
  onQuit: LifecycleCallback
}

type Callback = (...args: any[]) => any

export interface ICommandSpec {
  command: string
  description: string
}

export interface ICommand<T extends Callback = Callback> extends ICommandSpec {
  callback: T
}

export interface IPluginQuery {
  commands: ICommandSpec[]
  onQuery(command: string): Promise<ICommand[]>
}

export interface IPlugin {
  metadata: IPluginMetaData
  lifecycle: ILifecycle
  query: IPluginQuery
}
