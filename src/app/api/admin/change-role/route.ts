import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/validate'

const VALID_ROLES = ['student', 'teacher', 'admin']

export async function POST(req: Request) {
  try {
    // تحقق أن المستخدم الحالي أدمن
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: admin } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (admin?.role !== 'admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId, role } = await req.json()

    if (!userId || !isValidUUID(userId))
      return NextResponse.json({ error: 'userId غير صالح' }, { status: 400 })
    if (!VALID_ROLES.includes(role))
      return NextResponse.json({ error: 'role غير صالح' }, { status: 400 })
    if (userId === user.id && role !== 'admin')
      return NextResponse.json({ error: 'لا يمكنك تغيير صلاحيتك الخاصة' }, { status: 400 })

    // استخدم Admin Client لتجاوز RLS
    const adminClient = createSupabaseAdminClient()

    // 1. تحديث profiles
    const { error: profileErr } = await adminClient
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (profileErr) {
      console.error('[CHANGE_ROLE_PROFILE]', profileErr)
      return NextResponse.json({ error: 'فشل تحديث الصلاحية: ' + profileErr.message }, { status: 500 })
    }

    // 2. تحديث user_metadata في Auth (يجعل الدور يُقرأ فور تسجيل الدخول)
    const { error: authErr } = await adminClient.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })

    if (authErr) {
      console.error('[CHANGE_ROLE_AUTH]', authErr)
      // لا نُرجع خطأ — profiles تحدّثت بنجاح
    }

    return NextResponse.json({ ok: true, role })

  } catch (err: any) {
    console.error('[CHANGE_ROLE]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
