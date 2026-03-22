import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'

export async function POST(req: Request) {
  // ⛔ Rate limit: 5 محاولات كل 60 ثانية
  if (isRateLimited(getIP(req), { limit: 5, window: 60 })) {
    return NextResponse.json(
      { error: 'محاولات كثيرة جداً، يرجى الانتظار دقيقة ثم المحاولة مجدداً.' },
      { status: 429 }
    )
  }

  const { name, email, message, subject } = await req.json()
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('contact_messages').insert({
    name, email, message,
    subject: subject || 'رسالة من نموذج التواصل',
    created_at: new Date().toISOString(),
  })

  if (error) {
    // حتى لو فشل الحفظ في DB، نعيد نجاح للمستخدم
    console.error('[CONTACT]', error)
  }

  return NextResponse.json({ ok: true })
}
