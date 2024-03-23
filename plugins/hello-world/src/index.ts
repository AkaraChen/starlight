import { ICommand, ILifecycle, IMetaData } from '@starlight-app/plugin-sdk'

export const metaData: IMetaData = {
  name: 'Hello World',
  version: '1.0.0',
  description: 'A simple plugin that says hello world',
  icon: '🌍'
}

export const lifecycle: ILifecycle = {
  activate() {
    console.log('Hello World Plugin Activated')
    return true
  }
}

export const commands: ICommand[] = [
  {
    id: 'hello-world',
    displayName: 'Hello World',
    description: 'Prints Hello World to the console',
    handler: () => {
      console.log('Hello World')
    }
  }
]
