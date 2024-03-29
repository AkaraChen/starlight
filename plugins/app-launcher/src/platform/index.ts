import { getMacOsCore } from './macos'
import { getWindowsCore } from './windows'

export const getCore = async () => {
  switch (process.platform) {
    case 'win32': {
      return await getWindowsCore()
    }
    case 'darwin': {
      // TODO: fix it, doesn't work, but no error
      return await getMacOsCore()
    }
    default: {
      return null
    }
  }
}
