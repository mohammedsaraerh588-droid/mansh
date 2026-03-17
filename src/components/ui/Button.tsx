import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'dark' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const vMap: Record<string, string> = {
      primary:   'btn btn-gold',
      gold:      'btn btn-gold',
      secondary: 'btn btn-outline',
      outline:   'btn btn-outline',
      ghost:     'btn btn-ghost',
      dark:      'btn btn-dark',
      danger:    'btn btn-danger',
    }
    const sMap: Record<string, string> = {
      sm:   'btn-sm',
      md:   'btn-md',
      lg:   'btn-lg',
      xl:   'btn-xl',
      icon: 'p-2',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(vMap[variant] || 'btn btn-gold', sMap[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
