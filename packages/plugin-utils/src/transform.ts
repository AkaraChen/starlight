import { ICommand, ILifecycle, IPlugin, IView } from '@starlight-app/plugin-sdk'

export interface ITranformedCommand extends ICommand {
  pluginId: string
}

export interface ITransformedView extends IView {
  pluginId: string
}

export interface ITransformedPlugin extends IPlugin {
  id: string
  commands?: ITranformedCommand[]
  views?: ITransformedView[]
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

export function transformPlugin(plugin: IPlugin): ITransformedPlugin {
  // Need better way to generate id
  const id = plugin.metaData.name
  return {
    id,
    metaData: plugin.metaData,
    lifecycle: transformLifecycle(plugin.lifecycle),
    commands: plugin.commands?.map((command) => {
      return {
        ...command,
        pluginId: id,
        handler: () => callWithErrorHandling(plugin, () => command.handler())
      }
    }),
    views: plugin.views?.map((view) => ({ ...view, pluginId: id })),
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
