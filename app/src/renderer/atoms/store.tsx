import { Provider } from 'jotai'
import { createStore } from 'jotai/vanilla'
import { FC, PropsWithChildren } from 'react'

export const store = createStore()

export const StoreProvider: FC<PropsWithChildren> = (properties) => {
  const { children } = properties
  return <Provider store={store}>{children}</Provider>
}
