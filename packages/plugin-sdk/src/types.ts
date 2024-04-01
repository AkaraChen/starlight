import { Observable } from 'rxjs'

export interface ISupport {
  windows: boolean
  macos: boolean
  linux: boolean
}

export interface IMetaData {
  id: string
  name: string
  version: string
  description: string
  icon: string
  support?: ISupport | (() => boolean) | boolean
}

export interface ILifecycle {
  activate?: () => void
  deactivate?: () => void
  update?: (oldVersion: string, newVersion: string) => void
  error?: (error: Error) => void
  focus?: () => void
}

export interface ICommand {
  id: string
  displayName: string
  description: string
  handler: () => void
  icon?: string
  runImediately?: boolean
}

export interface IView {
  id: string
  displayName: string
  component: React.JSX.Element
  searchable?: boolean
  icon?: string
}

export type SearchFunction = (query: string, abortSignal: AbortSignal) => Promise<ICommand[]>

export type MaybeObservable<T> = T | Observable<T>

export interface IPlugin {
  metaData: IMetaData
  lifecycle?: ILifecycle
  commands?: MaybeObservable<ICommand[]>
  views?: IView[]
  search?: SearchFunction
}
