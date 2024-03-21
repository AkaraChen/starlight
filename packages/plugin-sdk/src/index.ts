import { ICommand, ICommandSpec, IPlugin } from './types'

export const definePlugin = (plugin: IPlugin): IPlugin => {
  return plugin
}

export const defineCommand = (
  spec: ICommandSpec
): {
  spec: ICommandSpec
  create: (callback: ICommand['callback']) => ICommand
} => {
  return {
    spec,
    create: (callback: ICommand['callback']): ICommand => {
      return {
        ...spec,
        callback
      }
    }
  }
}

export * from './types'
