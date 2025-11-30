import { FC, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl bg-black/20 border transition-all duration-200',
          'text-slate-200 placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Input
