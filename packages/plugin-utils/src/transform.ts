import { ICommand, ILifecycle, IPlugin, IView, MaybeObservable } from '@starlight-app/plugin-sdk'
import { map } from 'rxjs'

export interface ITranformedCommand extends ICommand {
  pluginId: string
  icon: string
}

export interface ITransformedView extends IView {
  pluginId: string
  icon: string
}

export interface ITransformedPlugin extends IPlugin {
  id: string
  commands?: MaybeObservable<ITranformedCommand[]>
  views?: MaybeObservable<ITransformedView[]>
  supported: () => boolean
}

const callWithErrorHandling = (plugin: IPlugin, callback: () => void): void => {
  try {
    callback()
  } catch (error) {
    if (plugin.lifecycle?.error && error instanceof Error) {
      plugin.lifecycle.error(error)
    }
  }
}

const transformLifecycle = (lifecycle?: ILifecycle): ILifecycle => {
  if (!lifecycle) {
    return {}
  }
  for (const key in lifecycle) {
    if (key === 'error') {
      continue
    }
    if (typeof lifecycle[key] === 'function') {
      lifecycle[key] = callWithErrorHandling.bind(null, lifecycle[key])
    }
  }
  return lifecycle
}

const transformCommand = (plugin: IPlugin, command: ICommand): ITranformedCommand => {
  return {
    ...command,
    pluginId: plugin.metaData.name,
    handler: () => callWithErrorHandling(plugin, () => command.handler()),
    icon: command?.icon ?? plugin.metaData.icon
  }
}

const transformView = (plugin: IPlugin, view: IView): ITransformedView => {
  return {
    ...view,
    pluginId: plugin.metaData.name,
    icon: view?.icon ?? plugin.metaData.icon
  }
}

export function transformPlugin(plugin: IPlugin): ITransformedPlugin {
  // Need better way to generate id
  const id = plugin.metaData.name
  const getCommands = () => {
    if (!plugin.commands) return []
    if (plugin.commands instanceof Array) {
      return plugin.commands.map((command) => transformCommand(plugin, command))
    }
    return plugin.commands.pipe(
      map((project) => {
        return project.map((command) => transformCommand(plugin, command))
      })
    )
  }
  const getViews = () => {
    if (!plugin.views) return []
    if (plugin.views instanceof Array) {
      return plugin.views.map((view) => transformView(plugin, view))
    }
    return plugin.views.pipe(
      map((project) => {
        return project.map((view) => transformView(plugin, view))
      })
    )
  }
  return {
    id,
    metaData: plugin.metaData,
    lifecycle: transformLifecycle(plugin.lifecycle),
    commands: getCommands(),
    views: getViews(),
    supported() {
      const support = plugin.metaData.support
      if (typeof support === 'function') {
        return support()
      }
      if (typeof support === 'boolean') {
        return support
      }
      switch (process.platform) {
        case 'win32':
          return support?.windows ?? false
        case 'darwin':
          return support?.mac ?? false
        case 'linux':
          return support?.linux ?? false
        default:
          return false
      }
    }
  }
}
