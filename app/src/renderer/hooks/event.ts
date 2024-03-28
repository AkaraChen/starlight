/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

export const useEventListener = <T extends Event>(
  target: EventTarget,
  type: string,
  listener: (e: T) => void
) => {
  useEffect(() => {
    target.addEventListener(type, listener as any)
    return () => {
      target.removeEventListener(type, listener as any)
    }
  })
}
