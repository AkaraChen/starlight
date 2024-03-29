import { ICommand, PluginBuilder } from '@starlight-app/plugin-sdk'
import { BehaviorSubject } from 'rxjs'
import { Core } from './core'
import os from 'os'
import path from 'path'
import { shell } from 'electron'

const commands = new BehaviorSubject<ICommand[]>([])

const AppLauncher = new PluginBuilder()
  .meta({
    name: 'App Launcher',
    description: 'Launch your app',
    version: '0.0.1',
    icon: '💎'
  })
  .lifecycle({
    activate() {
      const core = new Core({
        dirs: [
          // this one cause user experience issue
          // {
          //   dir: path.join(os.homedir(), 'scoop', 'shims'),
          //   resursive: true
          // }
          {
            dir: path.join(
              os.homedir(),
              'AppData',
              'Roaming',
              'Microsoft',
              'Windows',
              'Start Menu',
              'Programs'
            ),
            resursive: true
          },
          {
            dir: path.join(
              os.homedir(),
              'AppData',
              'Roaming',
              'Microsoft',
              'Windows',
              '「开始」菜单',
              '程序'
            ),
            resursive: true
          }
        ],
        exts: ['.exe', '.lnk']
      })
      core.subject.subscribe((execlutables) => {
        commands.next(
          execlutables.map((e) => {
            const name = path.basename(e.path, path.extname(e.path))
            return {
              displayName: name,
              description: `Launch ${name}`,
              handler: () => {
                shell.openPath(e.path)
              }
            }
          })
        )
      })
    }
  })
  .commands(commands)
  .build()

export default AppLauncher
