import {
  ClientEvent,
  IpcRequestEventName,
  IpcRequestPayload,
  IpcResponse,
} from '../constants/ipc'

export const callMain = <T extends IpcRequestEventName>(
  event: T,
  ...payload: IpcRequestPayload[T]
) => {
  return window.electron.ipcRenderer.sendSync(
    event,
    payload,
  ) as IpcResponse[typeof event]
}

export const sendEvent = (event: ClientEvent) => {
  window.electron.ipcRenderer.send(event)
}
