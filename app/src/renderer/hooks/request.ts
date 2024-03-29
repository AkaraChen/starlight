import { QueryClient, useQuery } from '@tanstack/react-query'
import { ServerEvent } from '../../constants/ipc'
import { api } from '../api'
import { ICommandDto, ITransformedView } from '@starlight/plugin-utils'

export const client = new QueryClient()

enum DataQueryKey {
  COMMANDS = '/commands',
  VIEWS = '/views'
}

export interface ServerData {
  commands?: ICommandDto[]
  views?: ITransformedView[]
}

window.electron.ipcRenderer.on(ServerEvent.COMMAND_UPDATE, () => {
  console.log('Command update')
  client.invalidateQueries({
    queryKey: [DataQueryKey.COMMANDS]
  })
})

window.electron.ipcRenderer.on(ServerEvent.VIEW_UPDATE, () => {
  console.log('View update')
  client.invalidateQueries({
    queryKey: [DataQueryKey.VIEWS]
  })
})

export const useServerData = (): ServerData => {
  const command = useQuery({
    queryKey: [DataQueryKey.COMMANDS],
    queryFn: () => api.plugin.commands.$get().then((res) => res.json())
  })
  const view = useQuery({
    queryKey: [DataQueryKey.VIEWS],
    queryFn: () => api.plugin.views.$get().then((res) => res.json())
  })

  return { commands: command.data, views: view.data }
}
