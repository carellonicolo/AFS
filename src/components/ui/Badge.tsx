import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const Badge: FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-slate-500/20 text-slate-200 border border-slate-500/20',
    success: 'bg-green-500/20 text-green-300 border border-green-500/20',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20',
    error: 'bg-red-500/20 text-red-300 border border-red-500/20',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  )
}

export default Badge
