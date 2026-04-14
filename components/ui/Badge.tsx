import { cn, VIBE_STYLES } from '@/utils'
import type { TripVibe } from '@/types'

export function VibeBadge({ vibe }: { vibe: TripVibe }) {
  const style = VIBE_STYLES[vibe] || VIBE_STYLES['Chill']
  return (
    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold', style.bg, style.text)}>
      {vibe}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    active:   'bg-green-100 text-green-800',
    full:     'bg-gray-100 text-gray-600',
  }
  return (
    <span className={cn('px-2.5 py-1 rounded-lg text-xs font-semibold capitalize', styles[status] || 'bg-gray-100 text-gray-600')}>
      {status}
    </span>
  )
}
