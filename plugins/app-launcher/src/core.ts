import chokidar from 'chokidar'
import { unique } from 'radash'
import { BehaviorSubject } from 'rxjs'

export interface SearchDir {
  dir: string
  resursive: boolean
}

export interface CoreOptions {
  dirs: SearchDir[]
  exts: string[]
  getInfo: (path: string) => Promise<Execlutable>
}

export interface Execlutable {
  name: string
  path: string
  icon: string
}

export class Core {
  watchers: chokidar.FSWatcher[] = []

  constructor(options: CoreOptions) {
    const { dirs, exts } = options
    for (const { dir, resursive } of dirs) {
      const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: false,
        depth: resursive ? undefined : 0,
      })
      watcher.on('add', async (path) => {
        const info = await options.getInfo(path)
        if (exts.some((extension) => path.endsWith(extension))) {
          this.next(...this.subject.value, info)
        }
      })
      watcher.on('unlink', (path) => {
        this.next(...this.subject.value.filter((e) => e.path !== path))
      })
      this.watchers.push(watcher)
    }
  }

  onDispose() {
    for (const watcher of this.watchers) {
      watcher.close()
    }
  }

  subject = new BehaviorSubject<Execlutable[]>([])

  next(...values: Execlutable[]) {
    this.subject.next(unique(values, (e) => e.path))
  }
}
