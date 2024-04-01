import { ICommand, ILifecycle, IPlugin, IView, MaybeObservable } from '@starlight-app/plugin-sdk'
import { map } from 'rxjs'
import emojiRegex from 'emoji-regex'
import fs from 'fs'
import mime from 'mime'
import { IMetaData } from '@starlight-app/plugin-sdk'
import { ICommandDto } from './dto'

export interface ITranformedCommand extends ICommand {
  pluginId: string
  icon: string
  runImediately: boolean
}

export interface ITransformedView extends IView {
  pluginId: string
  icon: string
}

export interface ITransformedMetaData extends IMetaData {
  support: boolean
}

export interface ITransformedPlugin extends IPlugin {
  id: string
  metaData: ITransformedMetaData
  commands?: MaybeObservable<ITranformedCommand[]>
  views?: ITransformedView[]
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

const transformMetaData = (metaData: IMetaData): ITransformedMetaData => {
  const isSupported = () => {
    if (typeof metaData.support === 'undefined') {
      return true
    }
    const support = metaData.support
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
        return support?.macos ?? false
      case 'linux':
        return support?.linux ?? false
      default:
        return false
    }
  }
  const support = isSupported()
  return {
    ...metaData,
    support
  }
}

const transformLifecycle = (plugin: IPlugin): ILifecycle => {
  const lifecycle = plugin.lifecycle
  if (!lifecycle) {
    return {}
  }
  for (const key in lifecycle) {
    if (key === 'error') {
      continue
    }
    if (typeof lifecycle[key] === 'function') {
      lifecycle[key] = callWithErrorHandling(plugin, () => lifecycle[key]())
    }
  }
  return lifecycle
}

const transformCommand = (plugin: IPlugin, command: ICommand): ITranformedCommand => {
  return {
    ...command,
    pluginId: plugin.metaData.id,
    handler: () => callWithErrorHandling(plugin, () => command.handler()),
    icon: command?.icon ? transformIcon(command.icon) : plugin.metaData.icon,
    runImediately: command.runImediately ?? true
  }
}

const transformView = (plugin: IPlugin, view: IView): ITransformedView => {
  return {
    ...view,
    pluginId: plugin.metaData.id,
    icon: view?.icon ? transformIcon(view.icon) : plugin.metaData.icon
  }
}

const transformIcon = (icon: string): string => {
  const isEmoji = emojiRegex().test(icon)
  if (isEmoji) {
    return icon
  }
  if (icon.startsWith('data:')) {
    return icon
  }
  const file = fs.readFileSync(icon)
  const base64 = Buffer.from(file).toString('base64')
  const mimeType = mime.getType(icon)
  if (!mimeType) throw new Error('Invalid mime type')
  return `data:${mimeType};base64,${base64}`
}

export function transformPlugin(plugin: IPlugin): ITransformedPlugin {
  plugin.metaData.icon = transformIcon(plugin.metaData.icon)
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
  return {
    id: plugin.metaData.id,
    metaData: transformMetaData(plugin.metaData),
    lifecycle: transformLifecycle(plugin),
    commands: getCommands(),
    views: plugin.views?.map((view) => transformView(plugin, view))
  }
}

export const getICommandDto = (command: ITranformedCommand): ICommandDto => {
  return {
    ...command,
    handler: undefined
  }
}
