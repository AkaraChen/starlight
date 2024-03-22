import clsx from 'clsx'
import { ReactNode, useEffect, useRef } from 'react'
import { CommandList } from './command'

function App(): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handler = (): void => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('focus', handler)
    }
  }, [])
  return (
    <div className={clsx('flex flex-col w-screen h-screen', 'bg-transparent')}>
      <div className="h-16 border-b border-zinc-900/10">
        <input
          ref={inputRef}
          type="text"
          className="w-full h-full px-6 text-sm bg-transparent border-none focus:outline-none placeholder:text-zinc-600"
          placeholder="Search for apps and commands..."
        />
      </div>

      <div className="h-full flex flex-col py-4">
        <CommandList
          title="Recent"
          commands={[
            {
              title: 'Vite',
              label: 'Window management',
              type: 'App'
            },
            {
              title: 'Vite',
              label: 'Window management',
              type: 'App'
            }
          ]}
        />
      </div>
      <div className="h-16 bg-native/60"></div>
    </div>
  )
}

export default App
