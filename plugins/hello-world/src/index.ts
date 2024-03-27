import { ICommand, ILifecycle, IMetaData, PluginBuilder } from '@starlight-app/plugin-sdk'

const metaData: IMetaData = {
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple plugin that says hello world',
  icon: '🌍'
}

const lifecycle: ILifecycle = {
  activate() {
    console.log('Hello World Plugin Activated')
    return true
  }
}

const commands: ICommand[] = [
  {
    id: 'hello-world',
    displayName: 'Hello World',
    description: 'Prints Hello World to the console',
    handler: () => {
      console.log('Hello World')
    }
  }
]

const HelloWorld = new PluginBuilder()
  .commands(commands)
  .meta(metaData)
  .lifecycle(lifecycle)
  .build()

export default HelloWorld
