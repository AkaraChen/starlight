import { ICommand, IPlugin, IView } from '@starlight-app/plugin-sdk'
import { BehaviorSubject, Observable, map, merge } from 'rxjs'

export const pluginSubject = new BehaviorSubject<IPlugin[]>([])

export const staticCommands$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.commands ?? []))
)

export const views$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.views ?? []))
)

export const searchableViews$ = pluginSubject.pipe(
  map((plugins) =>
    plugins
      .flatMap((plugin) => plugin.views ?? ([] as IView[]))
      .flatMap((view) => (view.searchable ? view : ([] as IView[])))
  )
)

export const openSearchableViewsCommands$ = searchableViews$.pipe(
  map((views) =>
    views.map(
      (view) =>
        ({
          id: view.id,
          displayName: view.displayName,
          handler() {
            // TODO: open search view
            console.log('open search view', view.component)
          }
        }) as ICommand
    )
  )
)

export const searchableCommands$ = merge(staticCommands$, openSearchableViewsCommands$)

// TODO: add open searchable view commands here

export const searchCommands$ = (query: string): Observable<ICommand[]> => {
  const abortController = new AbortController()
  setTimeout(() => {
    abortController.abort('Search command timeout')
  }, 1000)
  return new Observable<ICommand[]>((subscriber) => {
    // TODO: merge with searchable view commands
    pluginSubject.value.forEach(async (plugin) => {
      if (!abortController.signal.aborted) {
        return
      }
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
