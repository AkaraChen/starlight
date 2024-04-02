import path from 'node:path'
import { Core } from '../core'

export const getMacOsCore = async () => {
  return new Core({
    dirs: [
      {
        dir: path.join('/Applications'),
        resursive: true,
      },
    ],
    exts: ['.app'],
    async getInfo(file) {
      const name = path.basename(file, path.extname(file))
      return {
        name,
        path: file,
        icon: path.join(file, 'Contents', 'Resources', 'AppIcon.icns'),
      }
    },
  })
}
