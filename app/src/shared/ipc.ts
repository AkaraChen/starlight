import type { ICommandDto, ITransformedView } from '@starlight-app/plugin-utils'

export enum ServerEvent {
  PLUGIN_REGISTER = 'plugin-register',
  PLUGIN_UNREGISTER = 'plugin-unregister',

  COMMAND_UPDATE = 'command-update',
  VIEW_UPDATE = 'view-update',
}

export enum ClientEvent {
  PORT = 'port',
  HIDE = 'hide',
  BLUR = 'blur',
  FOCUS = 'focus',
  SHOW = 'show',
}

export enum IpcRequestEventName {
  GET_COMMANDS = 'get-commands',
  GET_VIEWS = 'get-views',
  EXECUTE_COMMAND = 'execute-command',
}

export type IpcRequestPayload = {
  [IpcRequestEventName.GET_COMMANDS]: []
  [IpcRequestEventName.GET_VIEWS]: []
  [IpcRequestEventName.EXECUTE_COMMAND]: [pluginId: string, commandId: string]
}

export type IpcResponse = {
  [IpcRequestEventName.GET_COMMANDS]: ICommandDto[]
  [IpcRequestEventName.GET_VIEWS]: ITransformedView[]
  [IpcRequestEventName.EXECUTE_COMMAND]: void
}
