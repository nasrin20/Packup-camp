'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Notification {
  id: string
  type: 'join_request' | 'request_approved' | 'request_declined' | 'new_message'
  title: string
  body: string
  link: string
  read: boolean
  created_at: string
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    async function load() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      setUnreadCount((data || []).filter((n: Notification) => !n.read).length)
    }
    load()

    // Subscribe to new notifications in realtime
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev])
        setUnreadCount(c => c + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    setNotifications(n => n.map(notif => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, markAllRead }
}
