'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSignup() {
  setLoading(true); setError('')
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: { data: { full_name: form.full_name } },
  })
  console.log('data:', data)
  console.log('error:', error)
  if (error) { setError(error.message); setLoading(false); return }
  router.push('/explore')
}

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <div className="text-4xl mb-2">⛺</div>
        <h1 className="text-2xl font-bold font-serif text-ember-400">Join PackUp</h1>
        <p className="text-forest-500 text-sm mt-1">Find your camping crew across Australia</p>
      </div>
      <Input label="Full name" placeholder="Your name" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
      <Input label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
      <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <Button size="lg" onClick={handleSignup} loading={loading}>Create Account — Free</Button>
      <p className="text-center text-forest-500 text-sm">
        Already have an account? <Link href="/login" className="text-ember-400 font-semibold">Sign in</Link>
      </p>
    </div>
  )
}
