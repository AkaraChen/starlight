import { ICommand, ILifecycle, IMetaData, IPlugin, IView, SearchFunction } from './types'

export * from './types'

export class PluginBuilder {
  private _meta: IMetaData
  private _commands: ICommand[] = []
  private _views: IView[] = []
  private _lifecycle: ILifecycle = {}
  private _search: SearchFunction
  meta(meta: IMetaData) {
    this._meta = meta
    return this
  }
  commands(commands: ICommand[]) {
    this._commands = commands
    return this
  }
  views(views: IView[]) {
    this._views = views
    return this
  }
  lifecycle(lifecycle: ILifecycle) {
    this._lifecycle = lifecycle
    return this
  }
  search(search: SearchFunction) {
    this._search = search
    return this
  }
  build(): IPlugin {
    return {
      metaData: this._meta,
      commands: this._commands,
      views: this._views,
      lifecycle: this._lifecycle,
      search: this._search
    }
  }
}
