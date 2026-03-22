import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'
import { sanitizeStr } from '@/lib/validate'

export async function POST(req: Request) {
  if (isRateLimited(getIP(req), { limit: 5, window: 60 })) {
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر قليلاً.' }, { status: 429 })
  }

  const { email, password, full_name } = await req.json()

  if (!email?.trim() || !password || !full_name?.trim()) {
    return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'كلمة المرور 6 أحرف على الأقل' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  // تحقق إذا البريد موجود مسبقاً
  const { data: existing } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = existing?.users?.find(u => u.email === email.toLowerCase().trim())

  if (existingUser) {
    if (existingUser.email_confirmed_at) {
      // مؤكد → أخبره بتسجيل الدخول
      return NextResponse.json({ error: 'هذا البريد مسجّل بالفعل. جرّب تسجيل الدخول.', code: 'confirmed' }, { status: 409 })
    }
    // غير مؤكد → أرسل رابط التأكيد من جديد
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'signup',
      email: existingUser.email!,
      password,
    })
    if (linkErr || !linkData?.properties?.action_link) {
      return NextResponse.json({ error: 'فشل إرسال البريد، حاول لاحقاً.' }, { status: 500 })
    }
    const sent = await sendConfirmationEmail(email, full_name, linkData.properties.action_link)
    if (!sent) return NextResponse.json({ error: 'فشل إرسال البريد. تحقق من عنوان البريد.' }, { status: 500 })
    return NextResponse.json({ ok: true, resent: true })
  }

  // مستخدم جديد — أنشئه
  const { data: newUser, error: createErr } = await admin.auth.admin.generateLink({
    type: 'signup',
    email: sanitizeStr(email, 255).toLowerCase().trim(),
    password,
    options: { data: { full_name: sanitizeStr(full_name, 100).trim() } },
  })

  if (createErr) {
    console.error('[SIGNUP]', createErr)
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى.' }, { status: 500 })
  }

  const confirmLink = newUser?.properties?.action_link
  if (!confirmLink) {
    return NextResponse.json({ error: 'فشل إنشاء رابط التأكيد.' }, { status: 500 })
  }

  const sent = await sendConfirmationEmail(email, full_name, confirmLink)
  if (!sent) {
    // احذف المستخدم إذا فشل الإرسال
    if (newUser?.user?.id) await admin.auth.admin.deleteUser(newUser.user.id, false)
    return NextResponse.json({ error: 'فشل إرسال البريد. تحقق من عنوان البريد الإلكتروني.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

async function sendConfirmationEmail(email: string, name: string, link: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'منصة تعلّم الطبية <onboarding@resend.dev>',
        to:      email,
        subject: 'أكّد بريدك الإلكتروني — منصة تعلّم',
        html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#F5F6FA;margin:0;padding:20px">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
    <div style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:32px;text-align:center">
      <div style="width:56px;height:56px;background:rgba(255,255,255,.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <span style="font-size:28px">🏥</span>
      </div>
      <h1 style="color:#fff;margin:0;font-size:22px">منصة تعلّم الطبية</h1>
    </div>
    <div style="padding:36px 32px">
      <h2 style="color:#1A1A2E;margin:0 0 12px;font-size:20px">أهلاً ${name}! 👋</h2>
      <p style="color:#6B7280;line-height:1.8;margin:0 0 28px">
        شكراً لتسجيلك في منصة تعلّم الطبية.<br>
        اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وبدء رحلتك التعليمية.
      </p>
      <div style="text-align:center;margin-bottom:28px">
        <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#1B5E20,#4CAF50);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:16px;font-weight:700">
          ✅ تأكيد البريد الإلكتروني
        </a>
      </div>
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0">
        الرابط صالح لمدة 24 ساعة.<br>
        إذا لم تطلب هذا التسجيل، تجاهل هذا البريد.
      </p>
    </div>
    <div style="background:#F9FAFB;padding:16px;text-align:center;border-top:1px solid #E5E7EB">
      <p style="color:#9CA3AF;font-size:12px;margin:0">© 2025 منصة تعلّم الطبية. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>`,
      }),
    })
    const result = await res.json()
    console.log('[RESEND]', res.status, result?.id || result?.message || JSON.stringify(result))
    return res.ok
  } catch (err) {
    console.error('[RESEND_ERROR]', err)
    return false
  }
}
