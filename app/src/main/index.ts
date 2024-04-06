import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import createDebug from 'debug'
import { BrowserWindow, app } from 'electron'
import { PluginManager } from './plugin'
import { createWindow } from './window'

if (require('electron-squirrel-startup')) app.quit()

const debug = createDebug('starlight:main')

debug('start')

app.whenReady().then(() => {
  debug('app ready')
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  PluginManager.init()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  PluginManager.onClose()
})

if (!is.dev) {
  debug('set login item settings')
  app.setLoginItemSettings({
    openAsHidden: true,
    openAtLogin: true,
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
