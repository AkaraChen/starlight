import { IPlugin } from '@starlight-app/plugin-sdk'
import { BehaviorSubject, map } from 'rxjs'

export const pluginSubject = new BehaviorSubject<IPlugin[]>([])

export const staticCommands$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.commands ?? []))
)

export const views$ = pluginSubject.pipe(
  map((plugins) => plugins.flatMap((plugin) => plugin.views ?? []))
)
