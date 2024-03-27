import { app } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { PluginManager } from './plugin'
import { createServer } from './server'
import './ipc'
import createDebug from 'debug'

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
  createServer()
})

if (!is.dev) {
  debug('set login item settings')
  app.setLoginItemSettings({
    openAsHidden: true,
    openAtLogin: true
  })
}
