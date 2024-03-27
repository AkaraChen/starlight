import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell, globalShortcut } from 'electron'
import { join } from 'path'

export let mainWindow: BrowserWindow

export function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    backgroundMaterial: 'acrylic',
    frame: false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (!is.dev) {
    globalShortcut.register('Alt+Space', () => {
      mainWindow.show()
      mainWindow.focus()
    })

    mainWindow.on('blur', () => {
      mainWindow.hide()
    })
  }
}