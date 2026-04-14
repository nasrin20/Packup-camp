import { cn } from '@/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:   'bg-ember-400 text-forest-900 hover:bg-ember-500 font-bold',
  secondary: 'bg-forest-800 text-forest-100 hover:bg-forest-700 border border-forest-600',
  ghost:     'bg-transparent text-forest-400 hover:bg-forest-800 border border-forest-700',
  danger:    'bg-red-600 text-white hover:bg-red-700 font-bold',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl w-full',
}

export default function Button({
  variant = 'primary', size = 'md', loading, children, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
