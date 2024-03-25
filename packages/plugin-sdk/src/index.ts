import { ICommand, ILifecycle, IMetaData, IPlugin, IView, SearchFunction } from './types'

export * from './types'

export class Plugin implements IPlugin {
  metaData: IMetaData
  lifecycle?: ILifecycle
  commands?: ICommand[]
  views?: IView[]
  search?: SearchFunction
}
