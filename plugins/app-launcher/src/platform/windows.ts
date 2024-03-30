/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import { Core } from '../core'
import { getWindowsDirs } from 'win-dirs'
import { shell, app } from 'electron'
import { extractIcon } from 'win-get-exe-icon'

const emptyImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAClklEQVRoge1ZwW7TQBB96/SYAz2jCv4CPgBVQhUSx9zgE6hoBKmEWoTUE5H6GfkTLuUf+gXUQK6Z4WB7Z3e8rjaeFBPhJ0XrXW+673nnzY5TYMSIESOGhFu8P32zmRTXE+ceDU1mGzDRLTm+LLhwl/86+ZNXr1utK4qnQHHtFh/OeGB+JhwAwOcvV0Pz6IWLT+cohiZhxShgaBykBlerFdbrdTQ2nU4xm82iseXNbyy//wK4ygNVw4BquUkTzPWw3Dt7doj588Ne63cKSE1MYXnzs+bREGpUcMBfCwnmgvH124+WgNz1OwXkgokjQlw/atdct3amPVe2px9MAlCT9ARrYr4b7Ybepaq1HkImDzBROs4TuyKkm/lhv9/6nQKyY5BY4jxpWsh4E066nwihv+cBlh0QHbFJ0QopSEgBw3qgMnHT4USahA8XBxcZW4Q9gIDsGNQmDlptWgbHZDkQ3Xd9qwfExImYDlOnT6sBe67HXP/1OwVkw4cQS/wD95Ju7nuhZGKwKxPftwPtzFO1tSeMJ4HNAySkXZiFgjFPWJNW50Wv9e0ekBCSS9kVeeAc+SEKIcP6nQKy4Ym0y4SokEsdWmHKNcB4DpCQ0fGvSwaEoYTYGwbYaiF1MIWlhIsEJarS8G/sWsA2tVBXemTVD0sOL5QYyYPAKiAXPoSgSuRkZRqeFc7fe5AdyEaLtH6dVGHkLzfx9w3Y0ftAd7kc3evwy84FZHtAV5/6pcXP0S8zwfeNMNdC4VONyuMkaXva1DD9LvTxxeOKOJGkVKo+7D8kZUWC/PnLJxYKth1YHB9hcXxkImDF3v8yt/8CNkxlWd4NzWNrlOUdmOjWzefv3k5QXFT/8dgfbJhKZjodmseIESP+d/wBHneWxrtRQOsAAAAASUVORK5CYII=`

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
      if (file.includes('Element')) {
        console.log(file, 'file')
      }
      const nativeIcon = (await app.getFileIcon(realPath, { size: 'large' })).toDataURL()
      const icon = nativeIcon === emptyImage ? await extractIcon(realPath) : nativeIcon
      return {
        name: path.basename(file, path.extname(file)),
        path: realPath,
        icon
      }
    }
  })
  return core
}
