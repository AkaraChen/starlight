# Commands

## Overview

Commands are functions that can be searched and executed from the Starlight interface. Commands are used to perform operations like opening a file, running a script, or searching for a file.

## Structure

```typescript
type Command = {
  id: string
  displayName: string
  description: string
  handler: () => void
}
```

## Custom search

Starlight use `fuse.js` to search all commands provided by plugins. The search is not case-sensitive and supports partial matching.

Plugin can define custom search behavior by providing a `search` function in the plugin. All search result will be combined with the commands provided by the plugin and put into the bottom of the search result.

Search function only be called when available commands are less than 5.

```typescript
import fs from 'fs/promises'
import { Command } from '@starlight/core'

export const spec = {
  name: 'my-plugin',
  version: '1.0.0',
  commands: [
    /* ... */
  ],
  search: async (
    query: string,
    abortSignal: AbortSignal,
  ): Command[] | undefined => {
    const files = await fs.readdir(os.homedir())
    if (abortSignal.aborted) {
      return
    }
    return files
      .filter(file => file.includes(query))
      .map(file => ({
        id: file,
        displayName: file,
        description: 'Open file',
        handler: () => {
          // Open file
        },
      }))
  },
}
```

::: tip Slow search
If the search function is slow, the user experience will be affected. So when search return after 1000ms, the search will be canceled. You can check the `abortSignal.aborted` to see if the search is canceled.
:::
