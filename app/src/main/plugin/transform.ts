import { ICommand, IPlugin, IView } from '@starlight-app/plugin-sdk'

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
}

export function transformPlugin(plugin: IPlugin): ITransformedPlugin {
  const id = plugin.metaData.name
  return {
    id,
    metaData: plugin.metaData,
    lifecycle: plugin.lifecycle,
    commands: plugin.commands?.map((command) => ({ ...command, pluginId: id })),
    views: plugin.views?.map((view) => ({ ...view, pluginId: id }))
  }
}
