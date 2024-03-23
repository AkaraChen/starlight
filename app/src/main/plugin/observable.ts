import { ICommand, IPlugin } from '@starlight-app/plugin-sdk'
import { BehaviorSubject, Observable, map } from 'rxjs'

export const pluginSubject = new BehaviorSubject<IPlugin[]>([])

export const staticCommands$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.commands ?? []))
)

export const views$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.views ?? []))
)

// TODO: add open searchable view commands here

export const searchCommands$ = (query: string): Observable<ICommand[]> => {
  const abortController = new AbortController()
  setTimeout(() => {
    abortController.abort('Search command timeout')
  }, 1000)
  return new Observable<ICommand[]>((subscriber) => {
    // TODO: merge with searchable view commands
    pluginSubject.value.forEach(async (plugin) => {
      try {
        const result = await plugin.search?.(query, abortController.signal)
        if (result) {
          subscriber.next(result)
        }
      } catch (error) {
        if (error instanceof Error) {
          subscriber.error(error)
        }
      }
    })
  })
}
