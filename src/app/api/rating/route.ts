import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'

export async function POST(req: Request) {
  if (isRateLimited(getIP(req), { limit: 5, window: 60 })) {
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر قليلاً.' }, { status: 429 })
  }
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId, rating, review } = await req.json()
  if (!courseId?.trim() || !rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })

  // تحقق أن الطالب مسجّل في الدورة
  const { data: enr } = await supabase.from('enrollments')
    .select('id').eq('student_id', session.user.id).eq('course_id', courseId).maybeSingle()
  if (!enr) return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })

  // حفظ التقييم أو تحديثه
  const { error } = await supabase.from('course_reviews').upsert({
    student_id: session.user.id,
    course_id:  courseId,
    rating,
    review:     review || null,
    created_at: new Date().toISOString(),
  }, { onConflict: 'student_id,course_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // تحديث متوسط التقييم في جدول courses
  const { data: reviews } = await supabase.from('course_reviews')
    .select('rating').eq('course_id', courseId)
  if (reviews?.length) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await supabase.from('courses').update({
      avg_rating:    Math.round(avg * 10) / 10,
      total_reviews: reviews.length,
    }).eq('id', courseId)
  }

  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

  const supabase = await createSupabaseServerClient()

  const { data: reviews } = await supabase.from('course_reviews')
    .select('rating,review,created_at,profiles(full_name,avatar_url)')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
    .limit(20)

  // تقييم المستخدم الحالي
  const { data: { session } } = await supabase.auth.getSession()
  let myRating = null
  if (session) {
    const { data } = await supabase.from('course_reviews')
      .select('rating,review').eq('student_id', session.user.id).eq('course_id', courseId).maybeSingle()
    myRating = data
  }

  return NextResponse.json({ reviews: reviews || [], myRating })
}
