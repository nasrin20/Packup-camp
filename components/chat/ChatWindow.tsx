'use client'
import { useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { useUser } from '@/hooks/useUser'
import Avatar from '@/components/ui/Avatar'
import { format } from 'date-fns'

export default function ChatWindow({ tripId }: { tripId: string }) {
  const { messages, loading, sendMessage, bottomRef } = useChat(tripId)
  const { profile } = useUser()
  const [input, setInput] = useState('')

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput('')
    await sendMessage(text)
  }

  if (loading) return <div className="flex-1 flex items-center justify-center text-forest-500">Loading chat...</div>

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map(msg => {
          const isMe = msg.sender_id === profile?.id
          const isSystem = msg.is_system

          if (isSystem) return (
            <div key={msg.id} className="text-center text-xs text-forest-600 py-1">
              <span className="font-medium text-forest-500">{msg.sender?.full_name}</span> {msg.content}
            </div>
          )

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && msg.sender && (
                <Avatar name={msg.sender.full_name} avatarUrl={msg.sender.avatar_url} size="sm" />
              )}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && <span className="text-xs text-forest-500">{msg.sender?.full_name}</span>}
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-ember-400 text-forest-900 rounded-tr-sm' : 'bg-forest-800 text-forest-100 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-forest-700">
                  {format(new Date(msg.created_at), 'h:mm a')}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-forest-800 bg-forest-900 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Message your crew..."
          className="flex-1 px-4 py-2.5 bg-forest-800 border border-forest-700 rounded-xl text-forest-100 text-sm placeholder:text-forest-600 focus:outline-none focus:border-ember-400"
        />
        <button onClick={handleSend}
          className="px-4 py-2.5 bg-ember-400 text-forest-900 rounded-xl font-bold text-sm">
          Send
        </button>
      </div>
    </div>
  )
}
