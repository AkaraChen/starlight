import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { PluginManager } from '../../plugin'
import { HTTPException } from 'hono/http-exception'
import Fuse from 'fuse.js'
import { ITranformedCommand } from '../../plugin/transform'

const manager = PluginManager.getInstance()

export const plugin = new Hono().get('/search', async (c) => {
  const keyword = c.req.query('keyword')
  if (!keyword) {
    throw new HTTPException(400, {
      message: 'keyword is required'
    })
  }
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
})
