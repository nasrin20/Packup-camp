'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TopBar from '@/components/layout/TopBar'
import AvatarUpload from '@/components/profile/AvatarUpload'
import ReviewsList from '@/components/profile/ReviewsList'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useUser } from '@/hooks/useUser'

const CAMPING_STYLES = ['Car camping', 'Backpacking', 'Glamping', 'Mixed']
const EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced']

export default function ProfilePage() {
  const { profile, loading } = useUser()
  const [editing, setEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info')
  const [form, setForm] = useState({
    bio: '', location: '', camping_style: '', experience_level: '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) })
  }, [])

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar_url)
      setForm({
        bio: profile.bio || '',
        location: profile.location || '',
        camping_style: profile.camping_style || '',
        experience_level: profile.experience_level || '',
      })
    }
  }, [profile])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update(form).eq('id', userId)
    setSaving(false)
    setEditing(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="p-8 text-center text-forest-500">Loading...</div>
  if (!profile) return null

  return (
    <div>
      <TopBar title="Profile" right={
        <button onClick={handleLogout} className="text-forest-500 text-sm">Sign out</button>
      } />

      <div className="px-4 py-6 flex flex-col gap-5">
        {/* Avatar + name + stats */}
        <div className="flex flex-col items-center gap-3">
          <AvatarUpload
            name={profile.full_name}
            avatarUrl={avatarUrl}
            userId={userId}
            onUploaded={setAvatarUrl}
          />
          <div className="text-center">
            <h2 className="text-xl font-bold text-forest-100">{profile.full_name}</h2>
            <p className="text-forest-500 text-sm">{profile.location || 'Australia'}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-ember-400">{profile.trips_completed}</p>
              <p className="text-xs text-forest-500 mt-0.5">Trips</p>
            </div>
            <div className="w-px bg-forest-800" />
            <div>
              <p className="text-2xl font-bold text-ember-400">{profile.experience_level || '—'}</p>
              <p className="text-xs text-forest-500 mt-0.5">Level</p>
            </div>
            <div className="w-px bg-forest-800" />
            <div>
              <p className="text-2xl font-bold text-ember-400">{profile.verified ? '✓' : '—'}</p>
              <p className="text-xs text-forest-500 mt-0.5">Verified</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forest-800">
          {(['info', 'reviews'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-sm capitalize border-b-2 transition-colors ${activeTab === t ? 'border-ember-400 text-ember-400 font-bold' : 'border-transparent text-forest-500'}`}>
              {t === 'info' ? 'Profile' : 'Reviews'}
            </button>
          ))}
        </div>

        {/* Info tab */}
        {activeTab === 'info' && (
          !editing ? (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Bio', value: profile.bio },
                { label: 'Camping style', value: profile.camping_style },
                { label: 'Experience', value: profile.experience_level },
              ].map(item => item.value && (
                <div key={item.label} className="bg-forest-800 rounded-xl p-4">
                  <p className="text-xs text-forest-500 mb-1">{item.label}</p>
                  <p className="text-forest-200 text-sm">{item.value}</p>
                </div>
              ))}
              <Button size="lg" variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input label="Bio" placeholder="Tell other campers about yourself..."
                value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              <Input label="Location" placeholder="e.g. Melbourne, VIC"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Camping style</label>
                <div className="grid grid-cols-2 gap-2">
                  {CAMPING_STYLES.map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, camping_style: s }))}
                      className={`py-2.5 rounded-xl text-sm border transition-colors ${form.camping_style === s ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-forest-400 uppercase tracking-wider">Experience level</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPERIENCE.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, experience_level: e }))}
                      className={`py-2.5 rounded-xl text-sm border transition-colors ${form.experience_level === e ? 'bg-ember-400 text-forest-900 border-ember-400 font-bold' : 'bg-forest-800 text-forest-400 border-forest-700'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" onClick={handleSave} loading={saving}>Save Changes</Button>
              <Button size="lg" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          )
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && userId && <ReviewsList userId={userId} />}
      </div>
    </div>
  )
}
