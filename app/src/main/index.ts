import { app } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWindow } from './window'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
})

if (!is.dev) {
  app.setLoginItemSettings({
    openAsHidden: true,
    openAtLogin: true
  })
}
