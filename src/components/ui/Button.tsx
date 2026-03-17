import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-all duration-200 px-6 py-3',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-2',
    }
    
    // For primary/secondary which already have padding defined in globals.css, we might want to override them if size is not md
    const sizeOverride = size === 'md' ? '' : sizes[size]

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          variants[variant],
          sizeOverride,
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin -ml-1 mr-2" />}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        {children}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
