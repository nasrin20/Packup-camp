'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import { useNotifications } from '@/hooks/useNotifications'
import { format } from 'date-fns'

const ICONS: Record<string, string> = {
  join_request:     '🙋',
  request_approved: '✅',
  request_declined: '❌',
  new_message:      '💬',
}

export default function NotificationsPage() {
  const [userId, setUserId] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const { notifications, unreadCount, markAllRead } = useNotifications(userId)

  return (
    <div>
      <TopBar title="Notifications" right={
        unreadCount > 0 ? (
          <button onClick={markAllRead} className="text-ember-400 text-sm font-semibold">
            Mark all read
          </button>
        ) : undefined
      } />

      <div className="px-4 py-4 flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-forest-400 font-semibold">No notifications yet</p>
            <p className="text-forest-600 text-sm mt-1">
              You'll be notified when someone joins your trip or approves your request
            </p>
          </div>
        ) : notifications.map(notif => (
          <Link key={notif.id} href={notif.link}>
            <div className={`flex gap-3 p-4 rounded-xl border transition-colors ${
              !notif.read
                ? 'bg-forest-800 border-forest-600'
                : 'bg-forest-900 border-forest-800'
            }`}>
              <span className="text-2xl flex-shrink-0">{ICONS[notif.type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${!notif.read ? 'text-forest-100' : 'text-forest-300'}`}>
                  {notif.title}
                </p>
                <p className="text-forest-500 text-xs mt-0.5 leading-relaxed">{notif.body}</p>
                <p className="text-forest-700 text-xs mt-1">
                  {format(new Date(notif.created_at), 'dd MMM · h:mm a')}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-ember-400 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
