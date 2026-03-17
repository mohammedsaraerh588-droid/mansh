import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; leftIcon?: React.ReactNode; helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--c-txt2)'}}>
          {label}{props.required && <span style={{color:'var(--c-err)',marginRight:3}}>*</span>}
        </label>
      )}
      <div className="inp-wrap">
        {leftIcon && <span className="inp-icon l">{leftIcon}</span>}
        <input ref={ref} className={cn('inp', leftIcon&&'inp-icon-l', error&&'inp-error', className)} {...props}/>
      </div>
      {error      && <p style={{marginTop:5,fontSize:12,fontWeight:600,color:'var(--c-err)'}}>{error}</p>}
      {helperText && !error && <p style={{marginTop:5,fontSize:12,color:'var(--c-txt3)'}}>{helperText}</p>}
    </div>
  )
)
Input.displayName = 'Input'
export { Input }
