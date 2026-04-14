'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function uploadAvatar(file: File, userId: string): Promise<string | null> {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${userId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)

      // Update profile
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId)

      return data.publicUrl
    } catch (e) {
      console.error('Avatar upload failed:', e)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadAvatar, uploading }
}
