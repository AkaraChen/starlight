import path from 'path'
import { Core } from '../core'
import { promisified as regedit } from 'regedit'

export const getWindowsCore = async () => {
  const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders`
  const list = await regedit.list([key])
  const startMenu = list[key].values['Programs'].value
  if (typeof startMenu !== 'string') {
    throw new Error('Can not get start menu path')
  }
  return new Core({
    dirs: [
      {
        dir: startMenu,
        resursive: true
      }
    ],
    exts: ['.exe', '.lnk'],
    async getInfo(file) {
       return {
        name: path.basename(file, path.extname(file)),
        path: file
      }
    }
  })
}
