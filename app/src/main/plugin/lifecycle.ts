import { Observable } from 'rxjs'
import * as HelloWorldPlugin from 'hello-world'
import { ICommand, IPlugin } from '@starlight-app/plugin-sdk'
import { pluginSubject } from './observable'

export const addPlugin = async (plugin: IPlugin): Promise<void> => {
  pluginSubject.next([...pluginSubject.value, plugin])
  try {
    plugin.lifecycle?.activate?.()
  } catch (error) {
    if (error instanceof Error) {
      plugin.lifecycle?.error?.(error)
      return
    }
    throw error
  }
}

export const loadBuildInPlugins = async (): Promise<void> => {
  const plugins = [HelloWorldPlugin]
  const promises = plugins.map(addPlugin)
  await Promise.all(promises)
}

export const onExit = async (): Promise<void> => {
  const plugins = pluginSubject.value
  plugins.forEach((plugin) => {
    try {
      plugin.lifecycle?.deactivate?.()
    } catch (error) {
      if (error instanceof Error) {
        plugin.lifecycle?.error?.(error)
        return
      }
      throw error
    }
  })
}

export const onReload = async (): Promise<void> => {
  await onExit()
  pluginSubject.next([])
  await loadBuildInPlugins()
}

export const searchCommand = (query: string): Promise<ICommand[]> => {
  return new Promise((resolve) => {
    const plugins = pluginSubject.value
    const abortController = new AbortController()
    const commands: ICommand[] = []
    setTimeout(() => {
      abortController.abort('Search command timeout')
      resolve(commands)
    }, 1000)
    const queryCommands$ = new Observable<ICommand[]>((subscriber) => {
      plugins.forEach(async (plugin) => {
        try {
          const result = await plugin.search?.(query, abortController.signal)
          if (result) {
            subscriber.next(result)
          }
        } catch (error) {
          if (error instanceof Error) {
            plugin.lifecycle?.error?.(error)
            return
          }
          subscriber.error(error)
        }
      })
    })
    queryCommands$.subscribe({
      next: (commands) => {
        commands.push(...commands)
      },
      error(err) {
        console.error(err)
      }
    })
  })
}
