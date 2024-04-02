import { createRequire } from 'node:module'
import { IPlugin } from '@starlight-app/plugin-sdk'

const require = createRequire(import.meta.url)

export const buildInPlugins: IPlugin[] = [
  require('hello-world').default,
  require('app-launcher').default,
  require('window-manager').default,
]
