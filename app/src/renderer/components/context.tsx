import { ICommandDto } from "@starlight/plugin-utils";
import { createContext, useContext } from "react";

export interface AppContext {
  search: string
  setSearch: (search: string) => void
  selected: number | null
  setSelected: (selected: number | null) => void
  onExecute: (command: ICommandDto) => void
  comands: ICommandDto[]
  query: ICommandDto[]
}

export const AppContext = createContext<AppContext>(undefined as never)

export const AppProvider = AppContext.Provider

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider')
  }
  return context
}
