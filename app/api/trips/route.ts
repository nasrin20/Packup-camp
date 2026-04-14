import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const admin = createAdminClient()

  let query = admin
    .from('trips')
    .select('*, host:profiles(*)')
    .eq('status', 'active')
    .order('start_date', { ascending: true })

  const state = searchParams.get('state')
  const vibe  = searchParams.get('vibe')
  if (state) query = query.eq('state', state)
  if (vibe)  query = query.eq('vibe', vibe)

  const { data, error } = await query
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  return NextResponse.json({ data, error: null })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()

  const { data, error } = await admin.from('trips').insert({
    ...body,
    host_id: user.id,
  }).select().single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  return NextResponse.json({ data, error: null })
}
