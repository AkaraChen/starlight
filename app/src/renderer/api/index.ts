import { getPort } from '../ipc'
import { hc } from 'hono/client'
import { io } from 'socket.io-client'

const port = await getPort()

export const api = hc(`http://localhost:${port}`)
export const socket = io(`http://localhost:${port}`)
