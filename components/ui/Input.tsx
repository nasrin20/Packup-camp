import { cn } from '@/utils'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className={cn(
          'w-full px-4 py-3 bg-forest-800 border border-forest-700 rounded-xl',
          'text-forest-100 placeholder:text-forest-600 text-sm',
          'focus:outline-none focus:border-ember-400 transition-colors',
          error && 'border-red-500',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
