import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/* POST /api/certificate
   يُستدعى تلقائياً عند وصول التقدم 100%
   يولّد شهادة ويحفظها في قاعدة البيانات */
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseId } = await req.json()

    // تحقق من أن الطالب أكمل 100%
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('progress_percentage, course_id')
      .eq('student_id', session.user.id)
      .eq('course_id', courseId)
      .single()

    if (!enrollment || enrollment.progress_percentage < 100) {
      return NextResponse.json({ error: 'Course not completed' }, { status: 400 })
    }

    // تحقق إن كانت الشهادة موجودة مسبقاً
    const { data: existing } = await supabase
      .from('certificates')
      .select('id, certificate_number')
      .eq('student_id', session.user.id)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ certificate: existing, already_exists: true })
    }

    // جلب بيانات الطالب والدورة
    const [{ data: profile }, { data: course }] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', session.user.id).single(),
      supabase.from('courses').select('title, teacher:profiles(full_name)').eq('id', courseId).single(),
    ])

    // توليد رقم شهادة فريد
    const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${session.user.id.slice(0,4).toUpperCase()}`
    const issuedAt   = new Date().toISOString()

    // حفظ الشهادة
    const { data: cert, error } = await supabase.from('certificates').insert({
      student_id:         session.user.id,
      course_id:          courseId,
      certificate_number: certNumber,
      student_name:       profile?.full_name || 'طالب',
      course_title:       course?.title || 'دورة',
      teacher_name:       (course?.teacher as any)?.full_name || 'معلم',
      issued_at:          issuedAt,
    }).select().single()

    if (error) throw error

    return NextResponse.json({ certificate: cert, new: true })
  } catch (err: any) {
    console.error('[CERTIFICATE]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/* GET /api/certificate?courseId=xxx — جلب شهادة موجودة */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = supabase.from('certificates')
    .select('*, courses(title,slug,thumbnail_url)')
    .eq('student_id', session.user.id)
    .order('issued_at', { ascending: false })

  if (courseId) query.eq('course_id', courseId)

  const { data } = await query
  return NextResponse.json({ certificates: data || [] })
}
