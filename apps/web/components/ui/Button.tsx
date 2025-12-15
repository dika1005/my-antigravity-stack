'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Spinner } from '../common/Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const variantStyles = {
    primary: `
    bg-gradient-to-r from-violet-600 to-indigo-600
    hover:from-violet-700 hover:to-indigo-700
    text-white shadow-lg shadow-violet-500/25
    border border-violet-500/20
  `,
    secondary: `
    bg-white/10 hover:bg-white/20
    text-white border border-white/20
    backdrop-blur-sm
  `,
    outline: `
    bg-transparent hover:bg-white/5
    text-white border border-white/30
    hover:border-white/50
  `,
    ghost: `
    bg-transparent hover:bg-white/10
    text-white/80 hover:text-white
  `,
}

const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <Spinner size="sm" />
                ) : leftIcon ? (
                    <span className="flex-shrink-0">{leftIcon}</span>
                ) : null}
                {children}
                {rightIcon && !isLoading && (
                    <span className="flex-shrink-0">{rightIcon}</span>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'
