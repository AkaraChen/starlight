/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import { Core } from '../core'
import { getWindowsDirs } from 'win-dirs'
import { shell } from 'electron'
import { extractIcon } from 'win-get-exe-icon'

export const getWindowsCore = async () => {
  const windowsDirs = await getWindowsDirs()
  const core = new Core({
    dirs: Object.entries(windowsDirs).map(([, dir]) => ({
      dir,
      resursive: true
    })),
    exts: ['.exe', '.lnk'],
    async getInfo(file) {
      const isLnk = path.extname(file) === '.lnk'
      const realPath = isLnk ? shell.readShortcutLink(file).target : file
      return {
        name: path.basename(file, path.extname(file)),
        path: realPath,
        icon: await extractIcon(realPath)
      }
    }
  })
  return core
}
