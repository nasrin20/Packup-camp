import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const { trip_id, content } = await req.json()
  const admin = createAdminClient()

  // Verify user is a trip member
  const { data: member } = await admin
    .from('trip_members').select('id').eq('trip_id', trip_id).eq('user_id', user.id).single()
  if (!member) return NextResponse.json({ data: null, error: 'Not a trip member' }, { status: 403 })

  const { data, error } = await admin.from('messages').insert({
    trip_id, sender_id: user.id, content,
  }).select().single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  return NextResponse.json({ data, error: null })
}
