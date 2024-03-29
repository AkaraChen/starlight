import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { PluginManager } from '../../plugin'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import createDebug from 'debug'
import { ICommandDto } from '@starlight/plugin-utils'

const debug = createDebug('starlight:plugin-router')

export const createPluginRouter = () => {
  const manager = PluginManager.getInstance()

  return new Hono()
    .get('/commands', (c) => {
      debug('get commands')
      return c.json(manager.commands.value as unknown as ICommandDto[])
    })
    .get('/views', (c) => {
      debug('get views')
      return c.json(manager.views.value)
    })
    .get(
      '/search',
      zValidator(
        'query',
        z.object({
          keyword: z.string()
        })
      ),
      async (c) => {
        const { keyword } = c.req.valid('query')
        debug('search', keyword)
        const abortController = new AbortController()
        setTimeout(() => {
          debug('abort search')
          abortController.abort()
        }, 1000)
        const search = await Promise.all(
          manager.plugins
            .filter((plugin) => !!plugin.search)
            .map((plugin) => plugin.search!(keyword, abortController.signal))
        )
        const result = search.flat()
        return streamSSE(c, async (stream) => {
          stream.write(JSON.stringify(result))
          stream.close()
        })
      }
    )
    .post(
      '/execute',
      zValidator(
        'json',
        z.object({
          pluginId: z.string(),
          commandName: z.string()
        })
      ),
      (c) => {
        const { pluginId, commandName } = c.req.valid('json')
        debug('execute command', pluginId, commandName)
        const command = manager.commands.value.find(
          (command) => command.pluginId === pluginId && command.displayName === commandName
        )
        if (!command) {
          throw new HTTPException(404, {
            message: 'Command not found'
          })
        }
        command.handler()
        return c.json({
          message: 'Command executed'
        })
      }
    )
}
