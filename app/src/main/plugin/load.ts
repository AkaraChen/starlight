import { IPlugin } from '@starlight-app/plugin-sdk'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const buildInPlugins: IPlugin[] = [require('hello-world').default]
