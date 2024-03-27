import { getPort } from '../ipc'
import { hc } from 'hono/client'
// @ts-ignore this is a type import
import type { AppType } from '../../main/server'

const port = await getPort()

export const api = hc<AppType>(`http://localhost:${port}`)
