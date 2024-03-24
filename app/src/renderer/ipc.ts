import { ipcRenderer } from 'electron-better-ipc'

export const getPort = async (): Promise<number> => {
  return ipcRenderer.callMain('port')
}
