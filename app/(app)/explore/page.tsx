'use client'
import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import TripCard from '@/components/trips/TripCard'
import { useTrips } from '@/hooks/useTrips'
import { AU_STATES } from '@/utils'
import type { TripVibe, TripFilters } from '@/types'

const VIBES: TripVibe[] = ['Chill', 'Adventure', 'Family', 'Solo-friendly']

export default function ExplorePage() {
  const [state, setState] = useState('')
  const [vibe, setVibe] = useState<TripVibe | ''>('')

  const filters: TripFilters = {}
  if (state) filters.state = state
  if (vibe) filters.vibe = vibe

  const { trips, loading } = useTrips(filters)

  return (
    <div>
      <TopBar />
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Search/filter bar */}
        <div className="flex gap-2">
          <select value={state} onChange={e => setState(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-forest-800 border border-forest-700 rounded-xl text-forest-300 text-sm focus:outline-none focus:border-ember-400">
            <option value="">All states</option>
            {AU_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Vibe filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setVibe('')}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${!vibe ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
            All vibes
          </button>
          {VIBES.map(v => (
            <button key={v} onClick={() => setVibe(v === vibe ? '' : v)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${vibe === v ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Trip count */}
        <p className="text-forest-500 text-xs">{loading ? 'Finding trips...' : `${trips.length} trip${trips.length !== 1 ? 's' : ''} available`}</p>

        {/* Trip list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-forest-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏕️</div>
            <p className="text-forest-400 font-semibold mb-1">No trips yet</p>
            <p className="text-forest-600 text-sm">Be the first to post one!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        )}
      </div>
    </div>
  )
}
