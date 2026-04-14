'use client'
import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import { format } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer: { full_name: string; avatar_url: string | null }
  trip: { location: string; start_date: string }
}

export default function ReviewsList({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reviews?user_id=${userId}`)
      .then(r => r.json())
      .then(({ data }) => { setReviews(data || []); setLoading(false) })
  }, [userId])

  if (loading) return <div className="text-forest-600 text-sm text-center py-4">Loading reviews...</div>
  if (reviews.length === 0) return (
    <div className="text-center py-6 text-forest-600 text-sm">No reviews yet — go camp with people! 🏕️</div>
  )

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-3">
      {/* Average rating */}
      <div className="bg-forest-800 rounded-xl p-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-ember-400">{avg.toFixed(1)}</p>
          <p className="text-xs text-forest-500 mt-0.5">avg rating</p>
        </div>
        <div>
          <div className="flex gap-1 mb-1">
            {[1,2,3,4,5].map(star => (
              <span key={star} className={`text-lg ${star <= Math.round(avg) ? 'text-ember-400' : 'text-forest-700'}`}>★</span>
            ))}
          </div>
          <p className="text-forest-500 text-xs">{reviews.length} review{reviews.length !== 1 ? 's' : ''} from fellow campers</p>
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.map(review => (
        <div key={review.id} className="bg-forest-800 border border-forest-700 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar name={review.reviewer.full_name} avatarUrl={review.reviewer.avatar_url} size="sm" />
              <div>
                <p className="text-forest-100 text-sm font-semibold">{review.reviewer.full_name}</p>
                <p className="text-forest-600 text-xs">{review.trip.location} · {format(new Date(review.trip.start_date), 'MMM yyyy')}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(star => (
                <span key={star} className={`text-sm ${star <= review.rating ? 'text-ember-400' : 'text-forest-700'}`}>★</span>
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-forest-400 text-sm leading-relaxed italic">"{review.comment}"</p>
          )}
        </div>
      ))}
    </div>
  )
}
