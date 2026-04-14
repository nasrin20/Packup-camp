'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/explore')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <div className="text-4xl mb-2">⛺</div>
        <h1 className="text-2xl font-bold font-serif text-ember-400">Welcome back</h1>
        <p className="text-forest-500 text-sm mt-1">Your crew is waiting</p>
      </div>
      <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <Button size="lg" onClick={handleLogin} loading={loading}>Sign In</Button>
      <p className="text-center text-forest-500 text-sm">
        No account? <Link href="/signup" className="text-ember-400 font-semibold">Sign up free</Link>
      </p>
    </div>
  )
}
