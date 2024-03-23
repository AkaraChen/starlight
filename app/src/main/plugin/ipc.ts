import { ICommand } from '@starlight-app/plugin-sdk'
import Fuse from 'fuse.js'
import { BehaviorSubject, Observable } from 'rxjs'
import { searchCommand } from './lifecycle'
import { staticCommands$ } from './observable'

const createFuse = (commands: ICommand[]): Fuse<ICommand> => {
  return new Fuse(commands, {
    keys: ['displayName', 'description'],
    includeScore: true,
    threshold: 0.3
  })
}

export const query = (query: string): Observable<ICommand[]> => {
  // TODO: search view
  const commandsSubject = new BehaviorSubject<ICommand[]>([])
  staticCommands$.subscribe((commands) => {
    const fuse = createFuse(commands)
    const result = fuse.search(query)
    commandsSubject.next(result.map((item) => item.item))
    if (result.length <= 5) {
      searchCommand(query).then((commands) => {
        commandsSubject.next([...commandsSubject.value, ...commands])
      })
    }
  })
  return commandsSubject
}
