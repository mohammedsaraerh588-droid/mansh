import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/validate'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ wishlist: [] })

  const { data } = await supabase
    .from('wishlist')
    .select('course_id, courses(id,title,slug,thumbnail_url,price,currency,level,avg_rating,total_students,profiles(full_name))')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ wishlist: data || [] })
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId } = await req.json()
  if (!isValidUUID(courseId)) return NextResponse.json({ error: 'Invalid courseId' }, { status: 400 })

  const { data: existing } = await supabase
    .from('wishlist').select('id').eq('user_id', session.user.id).eq('course_id', courseId).maybeSingle()

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id)
    return NextResponse.json({ action: 'removed' })
  } else {
    await supabase.from('wishlist').insert({ user_id: session.user.id, course_id: courseId })
    return NextResponse.json({ action: 'added' })
  }
}
