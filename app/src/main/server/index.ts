import { Hono } from 'hono'
import { Server as HTTPServer } from 'http'
import { Server } from 'socket.io'
import { serve } from '@honojs/node-server'
import { getRandomPort } from 'get-port-please'
import { ipcMain } from 'electron-better-ipc'

const server = new Hono()
export const io = new Server(server as unknown as HTTPServer)

export type AppType = typeof server

let port: number

ipcMain.answerRenderer('port', () => port)

const findPort = async (): Promise<number> => {
  const res = await getRandomPort('localhost')
  port = res
  return res
}

serve({
  ...server,
  port: await findPort()
})
