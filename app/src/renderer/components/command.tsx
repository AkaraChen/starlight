import { FC } from 'react'
import defaultIcon from '../assets/electron.svg'
import { ICommandDto } from '@starlight/plugin-utils'
import { api } from '../api'
import clsx from 'clsx'
import { useAppContext } from './context'

export interface CommandProps extends ICommandDto {
  active: boolean
}

export const Command: FC<CommandProps> = (props) => {
  const { active } = props
  const { setSelected } = useAppContext()
  return (
    <div
      className={clsx(
        'flex items-baseline justify-center px-3 py-2 hover:bg-black/5 rounded select-none',
        active && 'bg-black/5'
      )}
      onClick={() => {
        setSelected(null)
        api.plugin.execute.$post({
          json: {
            commandName: props.displayName,
            pluginId: props.pluginId
          }
        })
      }}
    >
      <img src={defaultIcon} alt={props.displayName} className={'w-3 h-3'} />
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

export interface CommandListProps {}

export const CommandList: FC<CommandListProps> = () => {
  const { query, selected } = useAppContext()
  return (
    <div className="flex flex-col px-3">
      {query.map((command, index) => {
        return (
          <Command
            key={`${command.pluginId}-${command.displayName}`}
            {...command}
            active={selected === index}
          />
        )
      })}
    </div>
  )
}
