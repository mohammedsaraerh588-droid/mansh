import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'
import { sanitizeStr } from '@/lib/validate'

async function sendEmailResend(to: string, name: string, link: string): Promise<boolean> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    'منصة تعلّم الطبية <onboarding@resend.dev>',
        to,
        subject: 'أكّد بريدك الإلكتروني — منصة تعلّم',
        text: `أهلاً ${name}!\n\nاضغط على الرابط التالي لتأكيد بريدك الإلكتروني:\n\n${link}\n\nالرابط صالح 24 ساعة.`,
        html: buildConfirmEmail(name, link, appUrl),
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[RESEND_ERROR]', err)
      return false
    }
    return true
  } catch (err) {
    console.error('[EMAIL_ERROR]', (err as Error).message)
    return false
  }
}

export async function POST(req: Request) {
  if (isRateLimited(getIP(req), { limit: 5, window: 60 })) {
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر دقيقة ثم أعد المحاولة.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const email    = sanitizeStr(body.email, 254).toLowerCase()
    const password = sanitizeStr(body.password, 128)
    const fullName = sanitizeStr(body.full_name, 100)

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }

    const adminClient = createSupabaseAdminClient()

    // تحقق إذا كان البريد موجوداً مسبقاً
    const { data: existing } = await adminClient
      .from('profiles').select('id').eq('email', email).maybeSingle()
    if (existing) {
      return NextResponse.json({ error: 'هذا البريد مسجّل بالفعل.', code: 'confirmed' }, { status: 409 })
    }

    // إنشاء المستخدم
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'
    const { error } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: false,
    })

    if (error) {
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'هذا البريد مسجّل بالفعل.', code: 'confirmed' }, { status: 409 })
      }
      console.error('[CREATE_USER_ERROR]', error)
      return NextResponse.json({ error: error.message || 'فشل إنشاء الحساب' }, { status: 500 })
    }

    // توليد رابط التأكيد
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { redirectTo: `${appUrl}/auth/callback` },
    })

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[LINK_ERROR]', linkError)
      return NextResponse.json({ ok: true, emailSent: false })
    }

    const confirmLink = linkData.properties.action_link

    // إرسال البريد عبر Resend
    const sent = await sendEmailResend(email, fullName, confirmLink)
    if (!sent) {
      console.warn('[EMAIL_NOT_SENT] user created but email failed:', email)
    }

    return NextResponse.json({ ok: true, emailSent: sent })

  } catch (err) {
    console.error('[SEND_CONFIRMATION]', err)
    return NextResponse.json({ error: 'حدث خطأ، يرجى المحاولة مرة أخرى.' }, { status: 500 })
  }
}

function buildConfirmEmail(name: string, link: string, appUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 20px">
    <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:36px 32px;text-align:center">
        <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,.15);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
          <span style="font-size:24px">⚕️</span>
        </div>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900">منصة تعلّم الطبية</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,.6);font-size:13px">أكّد بريدك الإلكتروني</p>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:32px">
        <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 12px">أهلاً <strong>${name}</strong>،</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.75;margin:0 0 24px">
          شكراً لتسجيلك في منصة تعلّم الطبية! اضغط على الزر أدناه لتأكيد بريدك والبدء برحلتك التعليمية.
        </p>
        <div style="text-align:center;margin:28px 0">
          <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#4CAF50,#2E7D32);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700">
            تأكيد البريد الإلكتروني ✓
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0">
          الرابط صالح لمدة 24 ساعة. إذا لم تطلب هذا التسجيل يمكنك تجاهل الرسالة.
        </p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:16px 32px;border-top:1px solid #f3f4f6;text-align:center">
        <p style="margin:0;font-size:11px;color:#9ca3af">منصة تعلّم الطبية — <a href="${appUrl}" style="color:#4CAF50;text-decoration:none">${appUrl}</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
