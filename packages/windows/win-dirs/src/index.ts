import { promisified as regedit } from 'regedit'

export interface WindowsDirectories {
  startMenu: string
  desktop: string
}

export const getWindowsDirs = async (): Promise<WindowsDirectories> => {
  const key = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders`
  const list = await regedit.list([key])
  const startMenu = list[key].values['Programs'].value as string
  const desktop = list[key].values['Desktop'].value as string
  return { startMenu, desktop }
}
