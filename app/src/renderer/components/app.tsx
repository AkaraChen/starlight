import { ICommandDto } from '@starlight/plugin-utils'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import { useAtomValue } from 'jotai'
import { CommandIcon, CornerDownLeftIcon as KbdEnterIcon } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { ClientEvent, IpcRequestEventName } from '../../constants/ipc'
import { commandsAtom } from '../atoms/data'
import { useEventListener } from '../hooks/event'
import { callMain, sendEvent } from '../ipc'
import { CommandList } from './command'
import { AppProvider } from './context'
import { KbdLabel } from './kbd'

function App() {
  const inputReference = useRef<HTMLInputElement>(null)
  useEventListener(window, 'focus', () => {
    if (inputReference.current) {
      inputReference.current.focus()
    }
  })
  const commands = useAtomValue(commandsAtom)
  const [search, setSearch] = useState('')
  const query: ICommandDto[] = useMemo(() => {
    if (!commands) return []
    if (!search) return commands
    const fuse = new Fuse(commands, {
      keys: ['displayName', 'description'],
    })
    return fuse.search(search).map((r) => r.item)
  }, [commands, search])
  const [selected, setSelected] = useState<number | null>(null)
  const execute = (command: ICommandDto) => {
    sendEvent(ClientEvent.HIDE)
    callMain(IpcRequestEventName.EXECUTE_COMMAND, command.pluginId, command.id)
  }
  useEventListener(window, 'keyup', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selected !== null) {
        e.stopPropagation()
        setSelected(null)
        inputReference.current?.focus()
        return
      }
      sendEvent(ClientEvent.HIDE)
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
    if (e.key.length === 1 && selected !== null) {
      inputReference.current?.focus()
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
        query,
      }}
    >
      <div className={clsx('flex flex-col w-screen h-screen', 'bg-native/75')}>
        <div className="h-16 border-b border-zinc-900/10">
          <input
            ref={inputReference}
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

        <div className="h-full my-2 flex flex-col overflow-x-hidden overflow-y-scroll scrollbar-none">
          {query && <CommandList />}
        </div>
        <div className="h-16 bg-native/50 flex px-4 py-2">
          <KbdLabel kbd={[CommandIcon, ',']}>Settings</KbdLabel>
          <div className="ml-auto flex items-center justify-center">
            <KbdLabel
              kbd={[KbdEnterIcon]}
              onClick={() => {
                const command = query[selected || 0]
                if (command) {
                  execute(command)
                }
              }}
            >
              Open Command
            </KbdLabel>
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export default App
