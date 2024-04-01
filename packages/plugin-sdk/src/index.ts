import { IPlugin } from './types'

export * from './types'

export class PluginBuilder {
  private _meta: IPlugin['metaData']
  private _commands: IPlugin['commands'] = []
  private _views: IPlugin['views'] = []
  private _lifecycle: IPlugin['lifecycle'] = {}
  private _search: IPlugin['search']
  meta(meta: IPlugin['metaData']) {
    this._meta = meta
    return this
  }
  commands(commands: IPlugin['commands']) {
    this._commands = commands
    return this
  }
  views(views: IPlugin['views']) {
    this._views = views
    return this
  }
  lifecycle(lifecycle: IPlugin['lifecycle']) {
    this._lifecycle = lifecycle
    return this
  }
  search(search: IPlugin['search']) {
    this._search = search
    return this
  }
  build(): IPlugin {
    if (!this._meta) {
      throw new Error('metaData is required')
    }
    return {
      metaData: this._meta,
      commands: this._commands,
      views: this._views,
      lifecycle: this._lifecycle,
      search: this._search,
    }
  }
}
