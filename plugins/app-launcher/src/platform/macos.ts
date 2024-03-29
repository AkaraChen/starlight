import path from 'path'
import { Core, Execlutable } from '../core'

export const getMacOsCore = async () => {
  return new Core({
    dirs: [
      {
        dir: path.join('/Applications'),
        resursive: true
      }
    ],
    exts: ['.app'],
    async getInfo(file) {
      const name = path.basename(file, path.extname(file))
      return {
        name,
        path: file
      } as Execlutable
    }
  })
}
