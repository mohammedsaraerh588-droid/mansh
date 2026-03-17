import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'secondary'|'ghost'|'danger'|'outline'
  size?: 'sm'|'md'|'lg'|'xl'|'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant='primary', size='md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const v: Record<string,string> = {
      primary:  'btn btn-primary',
      secondary:'btn btn-secondary',
      outline:  'btn btn-secondary',
      ghost:    'btn btn-ghost',
      danger:   'btn btn-danger',
    }
    const s: Record<string,string> = {
      sm:'btn-sm', md:'btn-md', lg:'btn-lg', xl:'btn-xl', icon:'p-2',
    }
    return (
      <button ref={ref} disabled={disabled||isLoading}
        className={cn(v[variant]||'btn btn-primary', s[size], className)} {...props}>
        {isLoading && <Loader2 size={15} className="spin"/>}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
