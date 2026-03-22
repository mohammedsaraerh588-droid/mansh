import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase/server'

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

    // جلب الـ userId من الطلب
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // منع حذف نفسه
    if (userId === session.user.id)
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })

    // استخدام Admin Client (Service Role) لحذف المستخدم من Auth
    const adminClient = createSupabaseAdminClient()
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) {
      console.error('[DELETE_USER]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // profiles تُحذف تلقائياً بسبب ON DELETE CASCADE
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[DELETE_USER]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
