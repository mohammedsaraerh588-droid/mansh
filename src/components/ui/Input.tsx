import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'input-field',
              rightIcon && 'pr-10',
              leftIcon && 'pl-10',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500/90">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-gray-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
