import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const { trip_id, reviewee_id, rating, comment } = await req.json()
  const admin = createAdminClient()

  // Must be a trip member to review
  const { data: member } = await admin
    .from('trip_members').select('id')
    .eq('trip_id', trip_id).eq('user_id', user.id).single()
  if (!member) return NextResponse.json({ data: null, error: 'Not a trip member' }, { status: 403 })

  const { data, error } = await admin.from('reviews').insert({
    trip_id, reviewer_id: user.id, reviewee_id, rating, comment,
  }).select().single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  return NextResponse.json({ data, error: null })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ data: null, error: 'user_id required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(*), trip:trips(location, start_date)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  return NextResponse.json({ data, error: null })
}
