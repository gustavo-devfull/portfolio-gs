import React from 'react'
import { cn } from '@/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'md'
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full font-medium'

    const variantStyles: Record<string, string> = {
      default: 'bg-accent/20 text-accent',
      secondary: 'bg-dark-surface text-dark-text border border-dark-text/20',
      outline: 'border border-accent text-accent',
    }

    const sizeStyles: Record<string, string> = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
