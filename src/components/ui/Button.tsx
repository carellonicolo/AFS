import { forwardRef, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 border border-primary-500/20',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 backdrop-blur-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 border border-red-500/20',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-slate-200',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      ref={ref}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
