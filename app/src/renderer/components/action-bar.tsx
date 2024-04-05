import type { FC, ReactNode } from 'react'

export interface ActionBarProps {
  left: ReactNode
  right: ReactNode
}

export const ActionBar: FC<ActionBarProps> = (props) => {
  return (
    <div className="h-16 bg-native/50 flex px-4 py-2">
      {props.left}
      <div className="ml-auto flex items-center justify-center">
        {props.right}
      </div>
    </div>
  )
}
