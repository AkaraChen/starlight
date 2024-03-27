import { ITranformedCommand } from './transform'

export type OmitFunction<T> = {
  [K in keyof T]: T[K] extends Function ? undefined : K
}

export type ICommandDto = OmitFunction<ITranformedCommand>
