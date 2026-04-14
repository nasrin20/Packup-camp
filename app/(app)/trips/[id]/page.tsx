'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import Avatar from '@/components/ui/Avatar'
import { VibeBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { formatTripDates, spotsLabel, tripNights } from '@/utils'
import type { Trip, JoinRequest } from '@/types'

export default function TripDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [myRequest, setMyRequest] = useState<JoinRequest | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: tripData } = await supabase
        .from('trips').select('*, host:profiles(*)').eq('id', id).single()
      setTrip(tripData)

      if (!user || !tripData) return
      setIsHost(user.id === tripData.host_id)

      const { data: member } = await supabase
        .from('trip_members').select('id').eq('trip_id', id).eq('user_id', user.id).single()
      setIsMember(!!member)

      const { data: req } = await supabase
        .from('join_requests').select('*').eq('trip_id', id).eq('requester_id', user.id).single()
      setMyRequest(req)
    }
    load()
  }, [id])

  async function handleJoinRequest() {
    setLoading(true)
    const res = await fetch('/api/join-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_id: id, message }),
    })
    const { data, error } = await res.json()
    if (error) { alert(error); setLoading(false); return }
    setMyRequest(data)
    setShowJoinForm(false)
    setLoading(false)
  }

  if (!trip) return <div className="flex-1 flex items-center justify-center text-forest-500 p-8">Loading...</div>

  const nights = tripNights(trip.start_date, trip.end_date)

  return (
    <div>
      <TopBar title={trip.location} showBack />
      <div className="px-4 py-4 pb-24 flex flex-col gap-5">
        {/* Host row */}
        <div className="flex items-center gap-3 justify-between">
          {trip.host && (
            <div className="flex items-center gap-3">
              <Avatar name={trip.host.full_name} avatarUrl={trip.host.avatar_url} size="md" />
              <div>
                <p className="text-xs text-forest-500">Hosted by</p>
                <p className="text-forest-100 font-semibold">{trip.host.full_name}</p>
              </div>
            </div>
          )}
          <VibeBadge vibe={trip.vibe} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📅', label: 'Dates', value: formatTripDates(trip.start_date, trip.end_date) },
            { icon: '🌙', label: 'Duration', value: `${nights} night${nights !== 1 ? 's' : ''}` },
            { icon: '👥', label: 'Spots', value: spotsLabel(trip.spots_total, trip.spots_taken) },
            { icon: '🏕️', label: 'Experience', value: trip.experience_required },
          ].map(item => (
            <div key={item.label} className="bg-forest-800 rounded-xl p-3">
              <p className="text-forest-500 text-xs mb-1">{item.icon} {item.label}</p>
              <p className="text-forest-100 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-forest-400 text-xs font-semibold uppercase tracking-wider mb-2">About this trip</h3>
          <p className="text-forest-300 text-sm leading-relaxed">{trip.description}</p>
        </div>

        {/* Tags */}
        {trip.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trip.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-forest-800 border border-forest-700 rounded-lg text-xs text-forest-400">{tag}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        {isHost ? (
          <Link href={`/trips/${trip.id}/chat`}>
            <Button size="lg" variant="secondary">View Trip Chat 💬</Button>
          </Link>
        ) : isMember ? (
          <Link href={`/trips/${trip.id}/chat`}>
            <Button size="lg">Open Group Chat 🔥</Button>
          </Link>
        ) : myRequest ? (
          <div className="bg-forest-800 rounded-xl p-4 text-center">
            <p className="text-forest-400 text-sm">
              {myRequest.status === 'pending' && '⏳ Request sent — waiting for host approval'}
              {myRequest.status === 'approved' && '✅ You\'re in! Check the group chat.'}
              {myRequest.status === 'declined' && '❌ Request declined'}
            </p>
          </div>
        ) : trip.status === 'full' ? (
          <Button size="lg" disabled>Trip is Full</Button>
        ) : showJoinForm ? (
          <div className="flex flex-col gap-3">
            <Textarea label="Message to host (optional)" rows={3}
              placeholder="Tell them a bit about yourself — camping experience, why you want to join..."
              value={message} onChange={e => setMessage(e.target.value)} />
            <Button size="lg" onClick={handleJoinRequest} loading={loading}>Send Join Request</Button>
            <Button size="lg" variant="ghost" onClick={() => setShowJoinForm(false)}>Cancel</Button>
          </div>
        ) : (
          <Button size="lg" onClick={() => setShowJoinForm(true)}>Request to Join 🏕️</Button>
        )}
      </div>
    </div>
  )
}
