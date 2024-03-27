import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { PluginManager } from '../../plugin'
import Fuse from 'fuse.js'
import { ITranformedCommand } from '../../plugin/transform'
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
      return streamSSE(c, async (sse) => {
        const fuse = new Fuse(manager.commands, {
          keys: ['description', 'displayName'] as Array<keyof ITranformedCommand>
        })
        const result = fuse.search(keyword)
        sse.writeSSE({
          data: JSON.stringify(result)
        })
        // TODO: add more search results
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
