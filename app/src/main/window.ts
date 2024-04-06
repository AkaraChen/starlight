import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import createDebug from 'debug'
import { BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import { ClientEvent } from '../shared/ipc'
import { PluginManager } from './plugin'

const debug = createDebug('starlight:window')

export let mainWindow: BrowserWindow

export function createWindow(): void {
  debug('create window')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
    backgroundMaterial: 'acrylic',
    frame: false,
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

  const getKey = () => {
    const keymap = {
      dev: {
        unix: 'Cmd+N',
        win32: 'Alt+Z',
      },
      prod: {
        unix: 'Command+Space',
        win32: 'Alt+Space',
      },
    }

    if (process.platform === 'darwin') {
      return is.dev ? keymap.dev.unix : keymap.prod.unix
    } else {
      return is.dev ? keymap.dev.win32 : keymap.prod.win32
    }
  }

  globalShortcut.register(getKey(), () => {
    debug('toggle window')
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('show', () => {
    debug('show window')
    PluginManager.onFocus()
  })

  if (!is.dev) {
    mainWindow.on('blur', () => {
      debug('hide window')
      mainWindow.hide()
    })
  }
}

ipcMain.on(ClientEvent.HIDE, () => {
  mainWindow.hide()
})

ipcMain.on(ClientEvent.BLUR, () => {
  mainWindow.blur()
})

ipcMain.on(ClientEvent.FOCUS, () => {
  mainWindow.focus()
})

ipcMain.on(ClientEvent.SHOW, () => {
  mainWindow.show()
})
