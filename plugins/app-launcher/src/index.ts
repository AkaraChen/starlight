import { type ICommand, PluginBuilder } from '@starlight-app/plugin-sdk'
import { shell } from 'electron'
import { BehaviorSubject } from 'rxjs'
import type { Core } from './core'
import { getCore } from './platform'

const commands = new BehaviorSubject<ICommand[]>([])

let core: Core

const AppLauncher = new PluginBuilder()
  .meta({
    id: 'app-launcher',
    name: 'App Launcher',
    description: 'Launch your app',
    version: '0.0.1',
    icon: '💎',
    support: {
      windows: true,
      macos: false,
      linux: false,
    },
  })
  .lifecycle({
    activate() {
      getCore().then((c) => {
        core = c
        core?.subject.subscribe((execlutables) => {
          commands.next(
            execlutables.map((e) => ({
              id: `launch-${e.name}`,
              displayName: e.name,
              description: `Launch ${e.name}`,
              icon: e.icon,
              handler() {
                shell.openPath(e.path)
              },
            })),
          )
        })
      })
    },
    deactivate() {
      core?.onDispose()
    },
  })
  .commands(commands)
  .build()

export default AppLauncher
