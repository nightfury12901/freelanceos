import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET  /api/clients  —  list all clients for the current user
// POST /api/clients  —  create a new client
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await (supabase as any)
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { 
    name, company, email, phone, role, status, notes, tags,
    project_title, project_description, project_deadline, progress_percent, milestones
  } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { data, error } = await (supabase as any)
    .from('clients')
    .insert({
      user_id: user.id,
      name: name.trim(),
      company: company?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      role: role?.trim() || null,
      status: status || 'active',
      notes: notes?.trim() || null,
      tags: tags?.length ? tags : null,
      // Project tracking fields
      project_title: project_title?.trim() || null,
      project_description: project_description?.trim() || null,
      project_deadline: project_deadline || null,
      progress_percent: progress_percent ?? 0,
      milestones: milestones || [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
