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
    secondary: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm',
    danger: 'bg-red-500/80 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border border-red-500/20',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200',
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
