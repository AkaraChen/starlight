import clsx from 'clsx'
import { useMemo, useRef, useState } from 'react'
import { CommandList } from './command'
import { ICommandDto } from '@starlight/plugin-utils'
import { api } from '../api'
import Fuse from 'fuse.js'
import { useEventListener } from '../hooks/event'
import { ClientEvent } from '../../constants/ipc'
import { AppProvider } from './context'
import { useServerData } from '../hooks/request'

window.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    if (history.length > 1) {
      history.back()
    } else {
      if (!import.meta.env.DEV) {
        window.electron.ipcRenderer.send(ClientEvent.HIDE)
      }
    }
  }
})

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  useEventListener(window, 'focus', () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  })
  const { commands } = useServerData()
  const [search, setSearch] = useState('')
  const query: ICommandDto[] = useMemo(() => {
    if (!commands) return []
    if (!search) return commands
    const fuse = new Fuse(commands, {
      keys: ['displayName', 'description']
    })
    return fuse.search(search).map((r) => r.item)
  }, [commands, search])
  const [selected, setSelected] = useState<number | null>(null)
  const execute = (command: ICommandDto) => {
    api.plugin.execute
      .$post({
        json: {
          commandName: command.displayName,
          pluginId: command.pluginId
        }
      })
      .catch((e) => {
        window.api.sendNotification(
          'Command failed',
          `Failed to execute command ${command.displayName}: ${e.message}`
        )
      })
  }
  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selected !== null) {
        setSelected(null)
        inputRef.current?.focus()
        e.stopPropagation()
        return
      }
    }
    if (e.key === 'Enter') {
      const command = query[selected || 0]
      if (command) {
        execute(command)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      if (selected === null) {
        setSelected(0)
        return
      }
      setSelected((s) => Math.min(s! + 1, query.length - 1))
    }
    if (e.key === 'ArrowUp') {
      if (selected === null) {
        setSelected(query.length - 1)
        return
      }
      setSelected((s) => Math.max(s! - 1, 0))
    }
    // detect if key is alphanumeric
    if (e.key.length === 1) {
      if (selected !== null) {
        inputRef.current?.focus()
      }
    }
  })
  return (
    <AppProvider
      value={{
        search,
        setSearch,
        selected,
        setSelected,
        onExecute: execute,
        comands: commands || [],
        query
      }}
    >
      <div className={clsx('flex flex-col w-screen h-screen', 'bg-transparent')}>
        <div className="h-16 border-b border-zinc-900/10">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelected(null)
            }}
            type="text"
            className="w-full h-full px-6 text-sm bg-transparent border-none focus:outline-none placeholder:text-zinc-600"
            placeholder="Search for apps and commands..."
          />
        </div>

        <div className="h-full flex flex-col py-4">{query && <CommandList />}</div>
        <div className="h-16 bg-native/60"></div>
      </div>
    </AppProvider>
  )
}

export default App
