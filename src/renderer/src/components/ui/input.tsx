import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-8 w-full rounded-fluent-sm border border-[var(--border)] bg-[var(--muted)]',
        'px-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
        'outline-none transition-colors',
        'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
