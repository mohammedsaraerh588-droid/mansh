import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/validate'

export async function DELETE(req: Request) {
  try {
    // تحقق أن المستخدم الحالي أدمن
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: adminProfile } = await supabase
      .from('profiles').select('role').eq('id', session.user.id).single()
    if (adminProfile?.role !== 'admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId } = await req.json()
    if (!userId || !isValidUUID(userId))
      return NextResponse.json({ error: 'userId غير صالح' }, { status: 400 })

    // منع حذف نفسه
    if (userId === session.user.id)
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })

    const adminClient = createSupabaseAdminClient()

    // خطوة 1: احذف من جداول البيانات يدوياً أولاً (في حال CASCADE لم يعمل)
    await adminClient.from('enrollments').delete().eq('student_id', userId)
    await adminClient.from('lesson_progress').delete().eq('student_id', userId)
    await adminClient.from('notifications').delete().eq('user_id', userId)
    await adminClient.from('wishlist').delete().eq('user_id', userId)
    await adminClient.from('lesson_notes').delete().eq('student_id', userId)
    await adminClient.from('certificates').delete().eq('student_id', userId)
    await adminClient.from('course_reviews').delete().eq('student_id', userId)
    await adminClient.from('quiz_attempts').delete().eq('student_id', userId)
    await adminClient.from('profiles').delete().eq('id', userId)

    // خطوة 2: احذف من Supabase Auth نهائياً (hard delete)
    const { error: authError } = await adminClient.auth.admin.deleteUser(
      userId,
      false  // shouldSoftDelete = false → حذف نهائي كامل
    )

    if (authError) {
      console.error('[DELETE_USER_AUTH]', authError)
      return NextResponse.json(
        { error: `فشل حذف الحساب: ${authError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, message: 'تم حذف المستخدم نهائياً' })

  } catch (err: any) {
    console.error('[DELETE_USER]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
