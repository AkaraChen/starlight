import type { ICommandDto } from '@starlight/plugin-utils'
import clsx from 'clsx'
import emojiRegex from 'emoji-regex'
import { type FC, useEffect, useMemo, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import defaultIcon from '../assets/electron.svg'
import { useAppContext } from './context'

export interface CommandProperties extends ICommandDto {
  active: boolean
  onExecute?: (command: ICommandDto) => void
  setSelected?: (index: number | null) => void
}

export const Command: FC<CommandProperties> = (properties) => {
  const { active, onExecute, setSelected } = properties
  const isEmoji = emojiRegex().test(properties.icon)
  useEffect(() => {
    if (active && reference.current) {
      scrollIntoView(reference.current, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }, [active])
  const reference = useRef<HTMLDivElement>(null)
  const displayName = useMemo(() => {
    if (properties.displayName.length > 30) {
      // find the first space after 30 characters
      const spaceIndex = properties.displayName.indexOf(' ', 30)
      if (spaceIndex > 0) {
        return `${properties.displayName.slice(0, spaceIndex)}...`
      }
      return `${properties.displayName.slice(0, 30)}...`
    }
    return properties.displayName
  }, [])
  return (
    <div
      className={clsx(
        'flex items-center justify-center px-3 py-2 hover:bg-black/5 rounded select-none',
        active && 'bg-black/5',
      )}
      ref={reference}
      onClick={() => {
        setSelected?.(null)
        onExecute?.(properties)
      }}
    >
      {isEmoji ? (
        <div className="size-5 flex items-center justify-center rounded bg-zinc-300">
          {properties.icon}
        </div>
      ) : (
        <img
          src={properties.icon || defaultIcon}
          alt={properties.displayName}
          className={'size-5'}
        />
      )}
      <div className={'ml-3 w-full flex items-center'}>
        <h2 className={'text-sm font-medium text-zinc-800'}>{displayName}</h2>
        <p className={'text-xs ml-3 text-zinc-600 max-w-96'}>
          {properties.description}
        </p>
      </div>
      <div className="ml-auto">
        <span className={'text-xs text-zinc-500'}>Command</span>
      </div>
    </div>
  )
}

// export interface CommandListProps {}

export const CommandList: FC = () => {
  const { query, selected, setSelected, onExecute } = useAppContext()
  return (
    <div className="flex flex-col px-3">
      {query.map((command, index) => {
        return (
          <Command
            key={`${command.pluginId}-${command.id}`}
            {...command}
            active={selected === index}
            onExecute={onExecute}
            setSelected={setSelected}
          />
        )
      })}
    </div>
  )
}
