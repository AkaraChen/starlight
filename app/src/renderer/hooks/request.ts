import useWebSocket from 'react-use-websocket'
import useSWR, { useSWRConfig } from 'swr'
import { StarLightEvent } from '../../constants/event'
import { api } from '../api'
import { ICommandDto, ITransformedView } from '@starlight/plugin-utils'

export const useServerEvent = (onEvent: (event: StarLightEvent) => void) => {
  const url = api.plugin.events.$url()
  return useWebSocket<StarLightEvent>(url.toString(), {
    onMessage(event) {
      onEvent(event.data)
    }
  })
}

enum DataQueryKey {
  COMMANDS = '/commands',
  VIEWS = '/views'
}

export interface ServerData {
  commands?: ICommandDto[]
  views?: ITransformedView[]
}

export const useServerData = (): ServerData => {
  const { mutate } = useSWRConfig()
  const { data: commands } = useSWR(DataQueryKey.COMMANDS, () =>
    api.plugin.commands.$get().then((res) => res.json())
  )
  const { data: views } = useSWR(DataQueryKey.VIEWS, () =>
    api.plugin.views.$get().then((res) => res.json())
  )
  useServerEvent((event) => {
    switch (event) {
      case StarLightEvent.COMMAND_UPDATE: {
        mutate(DataQueryKey.COMMANDS)
        break
      }
      case StarLightEvent.VIEW_UPDATE: {
        mutate(DataQueryKey.VIEWS)
        break
      }
    }
  })
  return { commands, views }
}
