export interface IMetaData {
  name: string
  version: string
  description: string
  icon: string
}

export interface ILifecycle {
  activate?: () => void
  deactivate?: () => void
  update?: (oldVersion: string, newVersion: string) => void
  error?: (error: Error) => void
}

export interface ICommand {
  id: string
  displayName: string
  description: string
  handler: () => void
}

export interface IView {
  id: string
  displayName: string
  component: React.JSX.Element
  searchable?: boolean
}

export type SearchFunction = (
  query: string,
  abortSignal: AbortSignal
) => Promise<ICommand[]>

export interface IPlugin {
  metaData: IMetaData
  lifecycle?: ILifecycle
  commands?: ICommand[]
  views?: IView[]
  search?: SearchFunction
}
