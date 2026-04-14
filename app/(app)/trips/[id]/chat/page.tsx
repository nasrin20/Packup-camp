'use client'
import { useParams } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import ChatWindow from '@/components/chat/ChatWindow'

export default function TripChatPage() {
  const { id } = useParams()
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Trip Chat" showBack />
      <ChatWindow tripId={id as string} />
    </div>
  )
}
