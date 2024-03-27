import { hc } from 'hono/client'
// @ts-ignore this is a type import
import type { AppType } from '../../main/server'
import { ClientEvent } from '../../constants/ipc'

const port = window.electron.ipcRenderer.sendSync(ClientEvent.PORT)

export const api = hc<AppType>(`http://localhost:${port}`)
