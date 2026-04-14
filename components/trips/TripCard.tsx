'use client'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { VibeBadge } from '@/components/ui/Badge'
import { formatTripDates, spotsLabel, tripNights } from '@/utils'
import type { Trip } from '@/types'

export default function TripCard({ trip }: { trip: Trip }) {
  const nights = tripNights(trip.start_date, trip.end_date)
  const spots = spotsLabel(trip.spots_total, trip.spots_taken)
  const isFull = trip.status === 'full'

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="bg-forest-900 border border-forest-800 rounded-2xl overflow-hidden hover:border-forest-600 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-forest-800 flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {trip.host && (
              <Avatar name={trip.host.full_name} avatarUrl={trip.host.avatar_url} size="md" />
            )}
            <div>
              <p className="text-forest-400 text-xs">{trip.host?.full_name}</p>
              <h3 className="text-forest-100 font-bold text-base leading-tight">{trip.location}</h3>
            </div>
          </div>
          <VibeBadge vibe={trip.vibe} />
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Meta row */}
          <div className="flex gap-4 mb-3 text-xs text-forest-500 font-sans flex-wrap">
            <span>📅 {formatTripDates(trip.start_date, trip.end_date)}</span>
            <span>🌙 {nights} night{nights !== 1 ? 's' : ''}</span>
            <span className={isFull ? 'text-red-400' : 'text-forest-400'}>
              👥 {spots}
            </span>
            {trip.distance_from_city && <span>🚗 {trip.distance_from_city}</span>}
          </div>

          {/* Description */}
          <p className="text-forest-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {trip.description}
          </p>

          {/* Tags */}
          {trip.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {trip.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-forest-800 border border-forest-700 rounded-lg text-xs text-forest-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
