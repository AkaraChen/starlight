import clsx from 'clsx'
import type { FC } from 'react'
import { Outlet } from 'react-router-dom'

export const AppLayout: FC = () => {
  return (
    <div className={clsx('flex flex-col w-screen h-screen', 'bg-native/75')}>
      <Outlet />
    </div>
  )
}
