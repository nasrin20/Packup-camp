'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils'

const NAV_ITEMS = [
  { href: '/explore',       icon: '🗺️',  label: 'Explore' },
  { href: '/trips/new',     icon: '➕',   label: 'Post Trip' },
  { href: '/my-trips',      icon: '⛺',  label: 'My Trips' },
  { href: '/notifications', icon: '🔔',  label: 'Alerts',   showBadge: true },
  { href: '/profile',       icon: '👤',  label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [unread, setUnread] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    async function loadUnread() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
      setUnread(count || 0)
    }
    loadUnread()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps // refresh on route change

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-forest-900 border-t border-forest-800 z-50">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
          return (
            <Link key={item.href} href={item.href} className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative',
              active ? 'text-ember-400' : 'text-forest-600 hover:text-forest-400'
            )}>
              <span className="text-xl relative">
                {item.icon}
                {item.showBadge && unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </span>
              <span className={cn('text-[10px] uppercase tracking-wider', active ? 'font-bold' : 'font-normal')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}