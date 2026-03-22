import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get('lessonId')

  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = supabase.from('lesson_notes')
    .select('id,content,timestamp_sec,created_at,lesson_id')
    .eq('student_id', session.user.id)
    .order('created_at', { ascending: false })

  if (lessonId) query.eq('lesson_id', lessonId)

  const { data } = await query
  return NextResponse.json({ notes: data || [] })
}

export async function POST(req: Request) {
  if (isRateLimited(getIP(req), { limit: 30, window: 60 })) {
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر قليلاً.' }, { status: 429 })
  }
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { lessonId, content, timestampSec } = await req.json()
  if (!lessonId || !content?.trim())
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const { data, error } = await supabase.from('lesson_notes').insert({
    student_id:    session.user.id,
    lesson_id:     lessonId,
    content:       content.trim(),
    timestamp_sec: timestampSec || 0,
    created_at:    new Date().toISOString(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ note: data })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const noteId = searchParams.get('id')

  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('lesson_notes').delete()
    .eq('id', noteId!).eq('student_id', session.user.id)

  return NextResponse.json({ ok: true })
}
