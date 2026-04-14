import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendJoinRequestEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const { trip_id, message } = await req.json()
  const admin = createAdminClient()

  const { data, error } = await admin.from('join_requests').insert({
    trip_id, requester_id: user.id, message,
  }).select().single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  // Send email notification to host
  try {
    const { data: trip } = await admin.from('trips').select('*, host:profiles(*)').eq('id', trip_id).single()
    const { data: requester } = await admin.from('profiles').select('full_name').eq('id', user.id).single()
    const hostUser = await admin.auth.admin.getUserById(trip.host_id)

    if (hostUser.data.user?.email) {
      await sendJoinRequestEmail({
        hostEmail: hostUser.data.user.email,
        hostName: trip.host.full_name,
        requesterName: requester.full_name,
        tripTitle: trip.title || trip.location,
        tripId: trip_id,
      })
    }
  } catch (e) { /* email failure shouldn't break the request */ }

  return NextResponse.json({ data, error: null })
}
