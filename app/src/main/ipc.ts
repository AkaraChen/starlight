import { ipcMain } from 'electron'
import {
  IpcRequestEventName,
  IpcRequestPayload,
  IpcResponse,
  ServerEvent,
} from '../constants/ipc'
import { mainWindow } from './window'

export const sendEvent = (event: ServerEvent) => {
  mainWindow.webContents.send(event)
}

export const answerEvent = <T extends IpcRequestEventName>(
  eventName: T,
  anwser: (payload: IpcRequestPayload[T]) => IpcResponse[T],
) => {
  ipcMain.on(eventName, (event, payload) => {
    event.returnValue = anwser(payload)
  })
}
