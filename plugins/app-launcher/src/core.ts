import { BehaviorSubject } from 'rxjs'
import chokidar from 'chokidar'

export interface SearchDir {
  dir: string
  resursive: boolean
}

export interface CoreOptions {
  dirs: SearchDir[]
  exts: string[]
}

export interface Execlutable {
  name: string
  path: string
}

export class Core {
  constructor(opts: CoreOptions) {
    const { dirs, exts } = opts
    for (const { dir, resursive } of dirs) {
      const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: false,
        depth: resursive ? undefined : 0
      })
      watcher.on('add', path => {
        if (exts.some(ext => path.endsWith(ext))) {
          this.subject.next([...this.subject.value, { name: path, path }])
        }
      })
      watcher.on('unlink', path => {
        this.subject.next(this.subject.value.filter(e => e.path !== path))
      })
    }
  }

  subject = new BehaviorSubject<Execlutable[]>([])
}
