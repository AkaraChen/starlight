import { Hono } from 'hono'
import { serve } from '@honojs/node-server'
import { getRandomPort } from 'get-port-please'
import { ipcMain } from 'electron-better-ipc'
import { plugin } from './router/plugin'

const server = new Hono().route('/plugin', plugin)

export type AppType = typeof server

let port: number

ipcMain.answerRenderer('port', () => port)

const findPort = async (): Promise<number> => {
  const res = await getRandomPort('localhost')
  port = res
  return res
}

export const initServer = async (): Promise<void> => {
  serve({
    ...server,
    port: await findPort()
  })
}
