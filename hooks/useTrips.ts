'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trip, TripFilters } from '@/types'

export function useTrips(filters?: TripFilters) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadTrips() {
      let query = supabase
        .from('trips')
        .select('*, host:profiles(*)')
        .eq('status', 'active')
        .order('start_date', { ascending: true })

      if (filters?.state)   query = query.eq('state', filters.state)
      if (filters?.vibe)    query = query.eq('vibe', filters.vibe)
      if (filters?.startDate) query = query.gte('start_date', filters.startDate)

      const { data } = await query
      setTrips(data || [])
      setLoading(false)
    }
    loadTrips()
  }, [filters?.state, filters?.vibe, filters?.startDate])

  return { trips, loading }
}
