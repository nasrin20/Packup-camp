'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import type { TripMember } from '@/types'

interface LeaveReviewProps {
  tripId: string
  members: TripMember[]
  currentUserId: string
  onDone: () => void
}

export default function LeaveReview({ tripId, members, currentUserId, onDone }: LeaveReviewProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const others = members.filter(m => m.user_id !== currentUserId)

  async function handleSubmit() {
    setLoading(true)
    await Promise.all(
      others
        .filter(m => ratings[m.user_id])
        .map(m =>
          fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trip_id: tripId,
              reviewee_id: m.user_id,
              rating: ratings[m.user_id],
              comment: comments[m.user_id] || null,
            }),
          })
        )
    )
    setLoading(false)
    onDone()
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-forest-100 font-bold text-lg mb-1">Rate your crew 🏕️</h3>
        <p className="text-forest-500 text-sm">Help others find great camping companions</p>
      </div>

      {others.map(member => (
        <div key={member.user_id} className="bg-forest-800 border border-forest-700 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-forest-100 font-semibold">{member.profile?.full_name}</p>

          {/* Star picker */}
          <div className="flex gap-2">
            {[1,2,3,4,5].map(star => (
              <button key={star} onClick={() => setRatings(r => ({ ...r, [member.user_id]: star }))}
                className={`text-2xl transition-transform hover:scale-110 ${star <= (ratings[member.user_id] || 0) ? 'text-ember-400' : 'text-forest-700'}`}>
                ★
              </button>
            ))}
          </div>

          {ratings[member.user_id] && (
            <Textarea placeholder="Leave a comment (optional)..." rows={2}
              value={comments[member.user_id] || ''}
              onChange={e => setComments(c => ({ ...c, [member.user_id]: e.target.value }))} />
          )}
        </div>
      ))}

      <Button size="lg" onClick={handleSubmit} loading={loading}
        disabled={Object.keys(ratings).length === 0}>
        Submit Reviews
      </Button>
    </div>
  )
}
