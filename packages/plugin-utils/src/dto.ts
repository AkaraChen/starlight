import type { ITranformedCommand } from './transform'

export type OmitFunction<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? undefined : T[K]
}

export type ICommandDto = OmitFunction<ITranformedCommand>

export const getICommandDto = (command: ITranformedCommand): ICommandDto => {
  return {
    ...command,
    handler: undefined,
  }
}
