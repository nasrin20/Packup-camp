'use client'
import { useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import { useAvatarUpload } from '@/hooks/useAvatarUpload'

interface AvatarUploadProps {
  name: string
  avatarUrl: string | null
  userId: string
  onUploaded: (url: string) => void
}

export default function AvatarUpload({ name, avatarUrl, userId, onUploaded }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const { uploadAvatar, uploading } = useAvatarUpload()

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadAvatar(file, userId)
    if (url) onUploaded(url)
  }

  return (
    <div className="relative w-fit mx-auto">
      <Avatar name={name} avatarUrl={avatarUrl} size="lg" />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-ember-400 text-forest-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
      >
        {uploading ? '...' : '✎'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
