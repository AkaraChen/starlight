# Concepts

Here are some concepts that are important to understand when developing with the SDK.

## Plugin

A plugin is a piece of Node.js code that extends the functionality of Starlight. Plugins can add new commands and views to the Starlight interface. Plugins are distributed as github repositories and can be installed using the Starlight app.

## Command

A command is a function that can be searched and executed from the Starlight interface. Commands are used to perform operations like opening a file, running a script, or searching for a file.

## View

A view is a React component that is displayed in the Starlight interface. Views are used to display information like search results, file contents, or a list of files.

## Plugin Spec

A plugin spec is a JavaScript module that exports metadata about the plugin, such as the name, version, commands, and views. The plugin spec is used by the Starlight app to load the plugin and display it in the interface.

For example, here is a plugin spec that defines a command and a view:

```typescript
import { PluginBuilder } from '@starlight-app/plugin-sdk'

const HelloWorld = new PluginBuilder()
  .meta({
    displayName: 'Hello World',
    description: 'A simple plugin that says hello',
    version: '1.0.0',
    support: {
      windows: true,
      mac: true,
      linux: true
    }
  })
  .lifecycle({
    activate: () => {
      console.log('Hello, world!')
    }
    deactivate: () => {
      console.log('Goodbye, world!')
    }
    error: (error) => {
      console.error('An error occurred:', error)
    }
  })
  .commands([
    {
      id: 'hello-world',
      displayName: 'Hello World',
      description: 'Say hello',
      handler: () => {
        alert('Hello, world!')
      }
    }
  ])
  .views([
    {
      id: 'hello-world',
      displayName: 'Hello World',
      component: () => <div>Hello, world!</div>
    }
  ])
  .search(async (query: string, abortSignal: AbortSignal) => {
    return [
      {
        id: 'hello-world',
        displayName: 'Hello World',
        description: 'Say hello',
        handler: () => {
          alert('Hello, world!')
        }
      }
    ]
  })
  .build()
```
