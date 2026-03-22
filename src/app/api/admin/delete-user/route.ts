import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/validate'

export async function DELETE(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // استخدم getUser() بدلاً من getSession() — أكثر موثوقية server-side
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // تحقق أن المستخدم أدمن
    const { data: adminProfile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 })
    }

    const body = await req.json()
    const { userId } = body

    if (!userId || !isValidUUID(userId)) {
      return NextResponse.json({ error: 'userId غير صالح' }, { status: 400 })
    }
    if (userId === user.id) {
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })
    }

    const adminClient = createSupabaseAdminClient()

    // تحقق أن المستخدم موجود أصلاً
    const { data: targetUser, error: findErr } = await adminClient.auth.admin.getUserById(userId)
    if (findErr || !targetUser?.user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // احذف البيانات يدوياً أولاً
    const tables = [
      { table: 'enrollments',    col: 'student_id' },
      { table: 'lesson_progress',col: 'student_id' },
      { table: 'notifications',  col: 'user_id'    },
      { table: 'wishlist',       col: 'user_id'    },
      { table: 'lesson_notes',   col: 'student_id' },
      { table: 'certificates',   col: 'student_id' },
      { table: 'course_reviews', col: 'student_id' },
      { table: 'quiz_attempts',  col: 'student_id' },
    ]
    for (const { table, col } of tables) {
      await adminClient.from(table).delete().eq(col, userId)
    }
    await adminClient.from('profiles').delete().eq('id', userId)

    // احذف من Supabase Auth — hard delete (shouldSoftDelete = false)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId, false)
    if (deleteError) {
      console.error('[DELETE_USER_AUTH_ERROR]', deleteError)
      return NextResponse.json(
        { error: `فشل الحذف من Auth: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })

  } catch (err: any) {
    console.error('[DELETE_USER_CATCH]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
