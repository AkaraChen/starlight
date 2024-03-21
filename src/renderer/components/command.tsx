import { FC, PropsWithChildren } from 'react'
import defaultIcon from '../assets/electron.svg'

export const CommandLabel: FC<PropsWithChildren> = (props) => {
  return <h2 className="text-sm font-medium text-zinc-500">{props.children}</h2>
}

export interface CommandProps {
  icon?: string
  title: string
  label: string
  type: string
}

export const Command: FC<CommandProps> = (props) => {
  return (
    <div className={'flex items-baseline justify-center px-3 py-2 hover:bg-black/5 rounded'}>
      <img src={defaultIcon} alt={props.title} className={'w-3 h-3'} />
      <div className={'ml-3 w-full flex items-center'}>
        <h2 className={'text-sm font-medium text-zinc-800'}>{props.title}</h2>
        <p className={'text-xs ml-3 text-zinc-600'}>{props.label}</p>
      </div>
      <div className="ml-auto">
        <span className={'text-xs text-zinc-500'}>{props.type}</span>
      </div>
    </div>
  )
}

export interface CommandListProps {
  title: string
  commands: CommandProps[]
}

export const CommandList: FC<CommandListProps> = (props) => {
  return (
    <div>
      <div className="ml-6">
        <CommandLabel>{props.title}</CommandLabel>
      </div>
      <div className="flex flex-col py-2 px-3">
        {props.commands.map((command, index) => {
          return <Command key={index} {...command} />
        })}
      </div>
    </div>
  )
}
