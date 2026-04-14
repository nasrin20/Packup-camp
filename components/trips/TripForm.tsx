'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { AU_STATES } from '@/utils'

const VIBES = ['Chill', 'Adventure', 'Family', 'Solo-friendly']
const EXPERIENCE = ['Any', 'Beginner', 'Intermediate', 'Advanced']
const COMMON_TAGS = ['Dog friendly', 'Campfire', 'Kayaking', 'Hiking', 'Lakeside', 'Coastal', 'Remote', 'Stargazing', 'Kids OK', '4WD required']

export default function TripForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [form, setForm] = useState({
    title: '', location: '', state: 'VIC', start_date: '', end_date: '',
    spots_total: '', vibe: 'Chill', experience_required: 'Any',
    description: '', distance_from_city: '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleTag(tag: string) {
    setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, spots_total: parseInt(form.spots_total), tags: selectedTags }),
      })
      const { data, error } = await res.json()
      if (error) throw new Error(error)
      router.push(`/trips/${data.id}`)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      <Input label="Trip title" placeholder="e.g. Weekend at Wilsons Prom" value={form.title} onChange={e => set('title', e.target.value)} />
      <Input label="Location" placeholder="e.g. Wilsons Prom, VIC" value={form.location} onChange={e => set('location', e.target.value)} />

      {/* State */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">State</label>
        <select value={form.state} onChange={e => set('state', e.target.value)}
          className="w-full px-4 py-3 bg-forest-800 border border-forest-700 rounded-xl text-forest-100 text-sm focus:outline-none focus:border-ember-400">
          {AU_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start date" type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
        <Input label="End date" type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
      </div>

      <Input label="Spots available" type="number" placeholder="e.g. 3" min="1" max="20"
        value={form.spots_total} onChange={e => set('spots_total', e.target.value)} />

      <Input label="Distance from nearest city" placeholder="e.g. 2hr from Melbourne"
        value={form.distance_from_city} onChange={e => set('distance_from_city', e.target.value)} />

      {/* Vibe */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Vibe</label>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map(v => (
            <button key={v} type="button" onClick={() => set('vibe', v)}
              className={`py-2.5 rounded-xl text-sm border transition-colors ${form.vibe === v ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Experience required</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE.map(e => (
            <button key={e} type="button" onClick={() => set('experience_required', e)}
              className={`py-2.5 rounded-xl text-sm border transition-colors ${form.experience_required === e ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <Textarea label="Description" rows={4}
        placeholder="Tell people about the trip — what you're planning, what gear to bring, the kind of crew you're looking for..."
        value={form.description} onChange={e => set('description', e.target.value)} />

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Tags</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map(tag => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${selectedTags.includes(tag) ? 'bg-forest-600 border-forest-500 text-forest-100' : 'bg-forest-800 border-forest-700 text-forest-500'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" onClick={handleSubmit} loading={loading}>
        Post Trip 🏕️
      </Button>
    </div>
  )
}