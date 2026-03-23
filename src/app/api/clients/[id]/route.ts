import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/clients/[id]  — update a client
// DELETE /api/clients/[id] — delete a client

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = [
    'name', 'company', 'email', 'phone', 'role', 'status', 'notes', 'tags', 'total_billed',
    'project_title', 'project_description', 'project_deadline', 'progress_percent', 'milestones'
  ]
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )

  const { data, error } = await (supabase as any)
    .from('clients')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await (supabase as any)
    .from('clients')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
