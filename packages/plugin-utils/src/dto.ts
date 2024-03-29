import { ITranformedCommand } from './transform'

export type OmitFunction<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? undefined : K
}

export type ICommandDto = OmitFunction<ITranformedCommand>
