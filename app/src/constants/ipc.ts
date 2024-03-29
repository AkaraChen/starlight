export enum ServerEvent {
  PLUGIN_REGISTER = 'plugin-register',
  PLUGIN_UNREGISTER = 'plugin-unregister',

  COMMAND_UPDATE = 'command-update',
  VIEW_UPDATE = 'view-update'
}

export enum ClientEvent {
  PORT = 'port',
  HIDE = 'hide',
  BLUR = 'blur',
  FOCUS = 'focus',
  SHOW = 'show'
}
