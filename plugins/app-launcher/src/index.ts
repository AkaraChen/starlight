import { ICommand, PluginBuilder } from '@starlight-app/plugin-sdk'
import { BehaviorSubject } from 'rxjs'
import { getCore } from './platform'
import { shell } from 'electron'
import { Core } from './core'

const commands = new BehaviorSubject<ICommand[]>([])

let core: Core

const AppLauncher = new PluginBuilder()
  .meta({
    name: 'App Launcher',
    description: 'Launch your app',
    version: '0.0.1',
    icon: '💎',
    support: {
      windows: true,
      macos: false,
      linux: false
    }
  })
  .lifecycle({
    activate() {
      getCore().then((_core) => {
        core = _core
        core?.subject.subscribe((execlutables) => {
          commands.next(
            execlutables.map((e) => ({
              displayName: e.name,
              description: `Launch ${e.name}`,
              handler() {
                shell.openPath(e.path)
              }
            }))
          )
        })
      })
    },
    deactivate() {
      core?.onDispose()
    }
  })
  .commands(commands)
  .build()

export default AppLauncher
