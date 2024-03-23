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
import { Command, View } from '@starlight/core';

export const lifecycle = {
  async activate(): boolean {
    console.log('Plugin activated');
    // Return true if the plugin is activated successfully
    return true;
  },
  async deactivate() {
    console.log('Plugin deactivated');
  },
  async update(
    oldVersion: string,
    newVersion: string
  ) {
    console.log('Plugin updated');
  },
  async error(error: Error) {
    console.error('Plugin error:', error);
  }
};

export const commands = [
  {
    id: 'hello-world',
    displayName: 'Hello, World!',
    description: 'Prints "Hello, World!" to the console',
    handler: () => {
      console.log('Hello, World!');
    }
  }
]

export const views = [
  {
    id: 'hello-world-view',
    displayName: 'Hello, World View',
    component: () => <Container>Hello, World!</Container>
  }
]

export const search = async (
  query: string,
  abortSignal: AbortSignal
): Command[] | undefined => {
  const files = await fs.readdir(os.homedir());
  if (abortSignal.aborted) {
    return;
  }
  return files
    .filter((file) => file.includes(query))
    .map((file) => ({
      id: file,
      displayName: file,
      description: 'Open file',
      handler: () => {
        // Open file
      }
    }));
}

export const metadata = {
  name: 'my-plugin',
  version: '1.0.0',
  icon: __dirname + '/icon.svg',
}
```
