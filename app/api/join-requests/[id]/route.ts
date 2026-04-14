import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendRequestApprovedEmail } from '@/lib/resend'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  const admin = createAdminClient()

  // Verify caller is the host
  const { data: request } = await admin.from('join_requests').select('*, trip:trips(*)').eq('id', params.id).single()
  if (request.trip.host_id !== user.id) return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })

  const { data, error } = await admin.from('join_requests').update({ status }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  // Email requester if approved
  if (status === 'approved') {
    try {
      const { data: host } = await admin.from('profiles').select('full_name').eq('id', user.id).single()
      const { data: requester } = await admin.from('profiles').select('full_name').eq('id', request.requester_id).single()
      const requesterUser = await admin.auth.admin.getUserById(request.requester_id)

      if (requesterUser.data.user?.email) {
        await sendRequestApprovedEmail({
          requesterEmail: requesterUser.data.user.email,
          requesterName: requester.full_name,
          tripTitle: request.trip.title || request.trip.location,
          tripId: request.trip_id,
          hostName: host.full_name,
        })
      }
    } catch (e) {}
  }

  return NextResponse.json({ data, error: null })
}
