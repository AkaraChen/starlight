/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path'
import { shell } from 'electron'
import { getWindowsDirs } from 'win-dirs'
import { extractIcon } from 'win-get-exe-icon'
import { Core } from '../core'

export const getWindowsCore = async () => {
  const windowsDirectories = await getWindowsDirs()
  console.log(windowsDirectories)
  const core = new Core({
    dirs: Object.entries(windowsDirectories).map(([, dir]) => ({
      dir,
      resursive: true,
    })),
    exts: ['.exe', '.lnk'],
    async getInfo(file) {
      const isLnk = path.extname(file) === '.lnk'
      const realPath = isLnk ? shell.readShortcutLink(file).target : file
      const icon = await extractIcon(realPath)
      return {
        name: path.basename(file, path.extname(file)),
        path: realPath,
        icon,
      }
    },
  })
  return core
}
