import type { ICommandDto, ITransformedView } from '@starlight/plugin-utils'
import { atom } from 'jotai'
import { IpcRequestEventName, ServerEvent } from '../../shared/ipc'
import { callMain } from '../ipc'
import { store } from './store'

export const commandsAtom = atom<ICommandDto[]>(
  callMain(IpcRequestEventName.GET_COMMANDS),
)
export const viewsAtom = atom<ITransformedView[]>(
  callMain(IpcRequestEventName.GET_VIEWS),
)

const updateCommands = () => {
  const commands = callMain(IpcRequestEventName.GET_COMMANDS)
  store.set(commandsAtom, commands)
}

const updateViews = () => {
  const views = callMain(IpcRequestEventName.GET_VIEWS)
  store.set(viewsAtom, views)
}

window.electron.ipcRenderer.on(ServerEvent.COMMAND_UPDATE, updateCommands)
window.electron.ipcRenderer.on(ServerEvent.VIEW_UPDATE, updateViews)
