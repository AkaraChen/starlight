import { ComponentPropsWithRef, forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

export interface KbdLabelProps extends ComponentPropsWithRef<'kbd'> {
  kbd: Array<LucideIcon | string>
}

export const KbdLabel = forwardRef<HTMLElement, KbdLabelProps>(function KbdLabel(props, ref) {
  const { kbd, children, ...rest } = props
  return (
    <kbd
      className="flex items-center justify-center px-2 py-1 bg-black/5 text-xs rounded select-none"
      {...rest}
      ref={ref}
    >
      <div className="flex gap-1">
        {kbd.map((Icon) => {
          if (typeof Icon === 'string') {
            return <span key={Icon}>{Icon}</span>
          }
          return <Icon key={Icon.displayName} size={16} />
        })}
      </div>
      <span className="ml-2">{children}</span>
    </kbd>
  )
})
