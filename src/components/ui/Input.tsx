import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--txt2)' }}>
          {label}{props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="inp-wrap">
        {leftIcon && <span className="inp-icon left">{leftIcon}</span>}
        <input
          ref={ref}
          className={cn('inp', leftIcon && 'inp-icon-l', error && 'inp-error', className)}
          {...props}
        />
      </div>
      {error      && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs" style={{ color:'var(--txt3)' }}>{helperText}</p>}
    </div>
  )
)
Input.displayName = 'Input'
export { Input }
