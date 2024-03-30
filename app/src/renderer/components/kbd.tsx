import { ComponentPropsWithRef, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

export interface KbdLabelProps extends ComponentPropsWithRef<'kbd'> {
  kbd: Array<LucideIcon | string>
}

export const KbdLabel = forwardRef<HTMLElement, KbdLabelProps>(function KbdLabel(props, ref) {
  const { kbd, children, ...rest } = props
  return (
    <kbd
      className="flex items-center justify-center px-2 py-1 text-xs rounded select-none font-sans"
      {...rest}
      ref={ref}
    >
      {children}
      <div className="flex gap-1 mx-1">
        {kbd.map((Key) => {
          return (
            <div
              key={typeof Key === 'string' ? Key : Key.displayName}
              className="bg-black/5 size-6 flex items-center justify-center rounded text-black/60"
            >
              {typeof Key === 'string' ? <span>{Key}</span> : <Key size={14} />}
            </div>
          )
        })}
      </div>
    </kbd>
  )
})
