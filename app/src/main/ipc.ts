import { ipcMain } from 'electron'
import { mainWindow } from './window'
import { ClientEvent } from '../constants/ipc'

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
