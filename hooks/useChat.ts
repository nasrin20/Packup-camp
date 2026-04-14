'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export function useChat(tripId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load existing messages
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      setLoading(false)
    }
    loadMessages()
  }, [tripId])

  // Subscribe to new messages in realtime
  useEffect(() => {
    const channel = supabase
      .channel(`trip-chat-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `trip_id=eq.${tripId}`,
        },
        async (payload) => {
          // Fetch sender profile for new message
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single()

          setMessages(prev => [...prev, { ...payload.new, sender } as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [tripId])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('messages').insert({
      trip_id: tripId,
      sender_id: user.id,
      content,
    })
  }

  return { messages, loading, sendMessage, bottomRef }
}
