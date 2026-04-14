'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import { StatusBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatTripDates } from '@/utils'
import type { Trip, JoinRequest } from '@/types'

export default function MyTripsPage() {
  const [hosted, setHosted] = useState<Trip[]>([])
  const [joined, setJoined] = useState<JoinRequest[]>([])
  const [pending, setPending] = useState<JoinRequest[]>([])
  const [tab, setTab] = useState<'hosting' | 'joined' | 'requests'>('hosting')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: hostedData } = await supabase
        .from('trips').select('*').eq('host_id', user.id).order('start_date')
      setHosted(hostedData || [])

      const { data: joinedData } = await supabase
        .from('join_requests').select('*, trip:trips(*)').eq('requester_id', user.id).eq('status', 'approved')
      setJoined(joinedData || [])

      const { data: pendingData } = await supabase
        .from('join_requests').select('*, requester:profiles(*)').in(
          'trip_id', (hostedData || []).map(t => t.id)
        ).eq('status', 'pending')
      setPending(pendingData || [])
    }
    load()
  }, [])

  async function handleRequest(requestId: string, status: 'approved' | 'declined') {
    await fetch(`/api/join-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setPending(p => p.filter(r => r.id !== requestId))
  }

  return (
    <div>
      <TopBar title="My Trips" />
      {/* Tabs */}
      <div className="flex border-b border-forest-800">
        {(['hosting', 'joined', 'requests'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm capitalize border-b-2 transition-colors ${tab === t ? 'border-ember-400 text-ember-400 font-bold' : 'border-transparent text-forest-500'}`}>
            {t} {t === 'requests' && pending.length > 0 && <span className="ml-1 bg-ember-400 text-forest-900 text-xs px-1.5 py-0.5 rounded-full font-bold">{pending.length}</span>}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Hosting tab */}
        {tab === 'hosting' && (
          <>
            <Link href="/trips/new"><Button size="lg">+ Post a New Trip</Button></Link>
            {hosted.length === 0 ? (
              <p className="text-center text-forest-500 text-sm py-8">No trips hosted yet</p>
            ) : hosted.map(trip => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <div className="bg-forest-800 border border-forest-700 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-forest-100 font-semibold">{trip.location}</p>
                    <p className="text-forest-500 text-xs mt-0.5">{formatTripDates(trip.start_date, trip.end_date)} · {trip.spots_taken}/{trip.spots_total} joined</p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Joined tab */}
        {tab === 'joined' && (
          joined.length === 0 ? (
            <p className="text-center text-forest-500 text-sm py-8">No approved trips yet. Go explore! 🗺️</p>
          ) : joined.map(req => (
            <Link key={req.id} href={`/trips/${req.trip?.id}/chat`}>
              <div className="bg-forest-800 border border-forest-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-forest-100 font-semibold">{req.trip?.location}</p>
                  <p className="text-forest-500 text-xs mt-0.5">{req.trip && formatTripDates(req.trip.start_date, req.trip.end_date)}</p>
                </div>
                <span className="text-forest-400 text-sm">💬</span>
              </div>
            </Link>
          ))
        )}

        {/* Requests tab */}
        {tab === 'requests' && (
          pending.length === 0 ? (
            <p className="text-center text-forest-500 text-sm py-8">No pending requests</p>
          ) : pending.map(req => (
            <div key={req.id} className="bg-forest-800 border border-forest-700 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-forest-600 rounded-full flex items-center justify-center text-sm font-bold text-forest-100">
                  {req.requester?.full_name?.[0]}
                </div>
                <div>
                  <p className="text-forest-100 font-semibold">{req.requester?.full_name}</p>
                  <p className="text-forest-500 text-xs">{req.requester?.location || 'Australia'} · {req.requester?.experience_level || 'Any level'}</p>
                </div>
              </div>
              {req.message && <p className="text-forest-400 text-sm italic">"{req.message}"</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleRequest(req.id, 'approved')} className="flex-1">✓ Approve</Button>
                <Button size="sm" variant="ghost" onClick={() => handleRequest(req.id, 'declined')} className="flex-1">Decline</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
