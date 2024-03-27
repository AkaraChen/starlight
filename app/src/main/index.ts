import { app } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { PluginManager } from './plugin'
import { initServer } from './server'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
})

PluginManager.init()
initServer()

if (!is.dev) {
  app.setLoginItemSettings({
    openAsHidden: true,
    openAtLogin: true
  })
}
