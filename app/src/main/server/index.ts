import { Hono } from 'hono'
import { serve } from '@honojs/node-server'
import { getRandomPort } from 'get-port-please'
import { ipcMain } from 'electron'
import { createPluginRouter } from './router/plugin'
import { cors } from 'hono/cors'
import createDebug from 'debug'
import { ClientEvent } from '../../constants/ipc'
import { createServer as createNodeServer } from 'http2'

const debug = createDebug('starlight:server')

export type AppType = Awaited<ReturnType<typeof createServer>>

let port: number

ipcMain.on(ClientEvent.PORT, (event) => {
  debug('get port', port)
  event.returnValue = port
})

const findPort = async (): Promise<number> => {
  const res = await getRandomPort('localhost')
  port = res
  return res
}

export const createServer = async () => {
  const server = new Hono()
    .use(
      '/*',
      cors({
        origin: '*'
      })
    )
    .route('/plugin', createPluginRouter())
  serve({
    ...server,
    port: await findPort(),
    serverOptions: {
      createServer: createNodeServer
    }
  })
  return server
}
