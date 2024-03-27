import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { PluginManager } from '../../plugin'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

const manager = PluginManager.getInstance()

export const plugin = new Hono()
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
      const abortController = new AbortController()
      setTimeout(() => {
        abortController.abort()
      }, 1000)
      const search = await Promise.all(
        manager.plugins
          .filter((plugin) => !!plugin.search)
          .map((plugin) => plugin.search!(keyword, abortController.signal))
      )
      const result = search.flat()
      return streamSSE(c, async (sse) => {
        sse.writeSSE({
          data: JSON.stringify(result)
        })
        sse.close()
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
      const command = manager.commands.find(
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
