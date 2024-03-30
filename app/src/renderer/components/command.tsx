import { FC, useEffect, useRef } from 'react'
import defaultIcon from '../assets/electron.svg'
import { ICommandDto } from '@starlight/plugin-utils'
import clsx from 'clsx'
import { useAppContext } from './context'
import emojiRegex from 'emoji-regex'
import scrollIntoView from 'scroll-into-view-if-needed'

export interface CommandProps extends ICommandDto {
  active: boolean
  onExecute?: (command: ICommandDto) => void
  setSelected?: (index: number | null) => void
}

export const Command: FC<CommandProps> = (props) => {
  const { active, onExecute, setSelected } = props
  const isEmoji = emojiRegex().test(props.icon)
  useEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [active])
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      className={clsx(
        'flex items-center justify-center px-3 py-2 hover:bg-black/5 rounded select-none',
        active && 'bg-black/5'
      )}
      ref={ref}
      onClick={() => {
        setSelected?.(null)
        onExecute?.(props)
      }}
    >
      {isEmoji ? (
        <div className="size-5 flex items-center justify-center rounded bg-zinc-300">
          {props.icon}
        </div>
      ) : (
        <img src={props.icon || defaultIcon} alt={props.displayName} className={'size-5'} />
      )}
      <div className={'ml-3 w-full flex items-center'}>
        <h2 className={'text-sm font-medium text-zinc-800'}>{props.displayName}</h2>
        <p className={'text-xs ml-3 text-zinc-600'}>{props.description}</p>
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
