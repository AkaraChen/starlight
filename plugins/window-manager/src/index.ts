import { ICommand, PluginBuilder } from '@starlight-app/plugin-sdk'
import { BehaviorSubject } from 'rxjs'
import { windowManager, Window } from 'node-window-manager'
import { getOpenWindowsSync } from 'active-win'
import { extractIcon } from 'win-get-exe-icon'

const commands = new BehaviorSubject<ICommand[]>([])

const baseCommands: ICommand[] = [
  {
    id: 'window-manager-hide-all',
    displayName: 'Hide all windows',
    icon: '🙈',
    description: 'Hide all windows',
    handler() {
      getOpenWindowsSync().forEach((window) => {
        const target = new Window(window.id)
        target.minimize()
      })
    },
  },
]

const next = (newCommands: ICommand[]) => {
  commands.next([...baseCommands, ...newCommands])
}

export const getActiveWindowCommands = (): Promise<ICommand[]> => {
  const windows = getOpenWindowsSync()
  const promises = windows.map(async (window) => {
    return {
      id: `window-manager-${window.id}`,
      displayName: window.title,
      icon: await extractIcon(window.owner.path),
      description: `Focus on ${window.owner.name}`,
      handler() {
        const target = new Window(window.id)
        if (!target.isWindow()) {
          console.error('Window not found')
        }
        // Is there any better way to check if the window is minimized?
        const isMinimized = window.bounds.height + window.bounds.width <= 300
        if (isMinimized) {
          target.restore()
        }
        target.bringToTop()
        console.log(`Focus on ${window.owner.name}`)
      },
    }
  })
  return Promise.all(promises)
}

const WindowManagerPlugin = new PluginBuilder()
  .meta({
    id: 'window-manager',
    name: 'Window Manager',
    version: '0.1.0',
    description: 'A plugin to manage windows',
    icon: '🪟',
    support: {
      windows: true,
      macos: false,
      linux: false,
    },
  })
  .lifecycle({
    activate() {
      windowManager.on('window-activated', () => {
        getActiveWindowCommands().then((newCommands) => {
          next(newCommands)
        })
      })
    },
  })
  .commands(commands)
  .build()

export default WindowManagerPlugin
