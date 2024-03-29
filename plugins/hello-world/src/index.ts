import { ICommand, ILifecycle, IMetaData, PluginBuilder } from '@starlight-app/plugin-sdk'
import path from 'path'

const metaData: IMetaData = {
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple plugin that says hello world',
  icon: '🌍'
}

const lifecycle: ILifecycle = {}

const commands: ICommand[] = [
  {
    displayName: 'Hello World',
    description: 'Prints Hello World to the console',
    handler: () => {
      console.log('Hello World')
    },
    icon: path.join(__dirname, '..', 'assets', 'extension_icon.svg')
  }
]

const HelloWorld = new PluginBuilder()
  .commands(commands)
  .meta(metaData)
  .lifecycle(lifecycle)
  .build()

export default HelloWorld
