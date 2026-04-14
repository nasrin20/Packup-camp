import { getInitials } from '@/utils'
import Image from 'next/image'

const COLORS = [
  'bg-ember-600', 'bg-forest-600', 'bg-blue-600',
  'bg-purple-600', 'bg-teal-600', 'bg-rose-600',
]

function colorFromName(name: string) {
  const i = name.charCodeAt(0) % COLORS.length
  return COLORS[i]
}

interface AvatarProps {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }

export default function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps) {
  if (avatarUrl) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0`}>
        <Image src={avatarUrl} alt={name} width={64} height={64} className="object-cover w-full h-full" />
      </div>
    )
  }
  return (
    <div className={`${sizes[size]} ${colorFromName(name)} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-white">{getInitials(name)}</span>
    </div>
  )
}
