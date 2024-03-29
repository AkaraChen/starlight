import { createStore } from 'jotai/vanilla'
import { Provider } from 'jotai'
import { FC, PropsWithChildren } from 'react'

export const store = createStore()

export const StoreProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props
  return <Provider store={store}>{children}</Provider>
}
