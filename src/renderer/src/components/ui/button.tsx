import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'accent' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-fluent-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[rgba(128,128,128,0.2)]':
              variant === 'default',
            'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]': variant === 'ghost',
            'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90':
              variant === 'accent',
            'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90':
              variant === 'destructive',
            'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)]':
              variant === 'outline'
          },
          {
            'h-7 px-2.5 text-xs': size === 'sm',
            'h-8 px-3 text-[13px]': size === 'md',
            'h-8 w-8 p-0': size === 'icon'
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
