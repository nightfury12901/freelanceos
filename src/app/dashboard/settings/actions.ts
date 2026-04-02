'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const gstin = formData.get('gstin') as string
  const profession = formData.get('profession') as string
  const lut_filed = formData.get('lut_filed') === 'true'

  const updates = {
    name: name?.trim() || null,
    gstin: gstin?.trim() || null,
    profession: profession?.trim() || null,
    lut_filed
  }

  const { error } = await supabase
    .from('users')
    .update(updates as never)
    .eq('id', user.id)

  if (error) {
    console.error('Update profile error:', error)
    return { error: 'Failed to save settings.' }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  
  return { success: true }
}
