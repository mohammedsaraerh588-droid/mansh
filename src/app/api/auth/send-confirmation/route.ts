import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'
import { sanitizeStr } from '@/lib/validate'
import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

async function sendEmail(to: string, name: string, link: string): Promise<boolean> {
  try {
    const transporter = getTransporter()
    await transporter.sendMail({
      from: `"منصة تعلّم الطبية" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'أكّد بريدك الإلكتروني — منصة تعلّم',
      // نص عادي للعملاء التي لا تدعم HTML
      text: `أهلاً ${name}!\n\nاضغط على الرابط التالي لتأكيد بريدك الإلكتروني:\n\n${link}\n\nالرابط صالح 24 ساعة.`,
      html: `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px">
<table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <tr>
    <td style="background:linear-gradient(135deg,#1B5E20,#4CAF50);padding:32px;text-align:center">
      <p style="color:#fff;margin:0;font-size:24px;font-weight:bold">🏥 منصة تعلّم الطبية</p>
    </td>
  </tr>
  <tr>
    <td style="padding:36px 32px;direction:rtl">
      <p style="color:#1A1A2E;font-size:20px;font-weight:bold;margin:0 0 12px">أهلاً ${name}! 👋</p>
      <p style="color:#6B7280;line-height:1.8;margin:0 0 28px">
        شكراً لتسجيلك في منصة تعلّم الطبية.<br>
        اضغط على الزر أدناه لتأكيد بريدك الإلكتروني.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:8px 0 28px">
            <a href="${link}"
               style="display:inline-block;background:#4CAF50;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:17px;font-weight:bold;border:none">
              ✅ تأكيد البريد الإلكتروني
            </a>
          </td>
        </tr>
      </table>
      <p style="color:#6B7280;font-size:14px;margin:0 0 12px">إذا لم يعمل الزر، انسخ هذا الرابط في متصفحك:</p>
      <p style="background:#F3F4F6;padding:12px;border-radius:8px;word-break:break-all;font-size:12px;color:#374151;margin:0 0 20px">
        <a href="${link}" style="color:#4CAF50">${link}</a>
      </p>
      <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0">
        الرابط صالح لمدة 24 ساعة.<br>
        إذا لم تطلب هذا التسجيل، تجاهل هذا البريد.
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#F9FAFB;padding:16px;text-align:center;border-top:1px solid #E5E7EB">
      <p style="color:#9CA3AF;font-size:12px;margin:0">© 2025 منصة تعلّم الطبية</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`,
    })
    return true
  } catch (err: any) {
    console.error('[EMAIL_ERROR]', err.message)
    return false
  }
}

export async function POST(req: Request) {
  if (isRateLimited(getIP(req), { limit: 5, window: 60 }))
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر قليلاً.' }, { status: 429 })

  const { email, password, full_name } = await req.json()
  if (!email?.trim() || !password || !full_name?.trim())
    return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
  if (password.length < 6)
    return NextResponse.json({ error: 'كلمة المرور 6 أحرف على الأقل' }, { status: 400 })

  const admin   = createSupabaseAdminClient()
  const cleanEmail = sanitizeStr(email, 255).toLowerCase().trim()
  const cleanName  = sanitizeStr(full_name, 100).trim()
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'

  // تحقق إذا البريد موجود
  const { data: existing } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = existing?.users?.find(u => u.email === cleanEmail)

  if (existingUser) {
    if (existingUser.email_confirmed_at)
      return NextResponse.json({ error: 'هذا البريد مسجّل بالفعل.', code: 'confirmed' }, { status: 409 })

    // غير مؤكد — أعد توليد الرابط
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'signup',
      email: cleanEmail,
      password,
      options: { redirectTo: `${appUrl}/auth/callback` },
    })
    if (linkErr || !linkData?.properties?.action_link)
      return NextResponse.json({ error: 'فشل توليد رابط التأكيد.' }, { status: 500 })

    const name = existingUser.user_metadata?.full_name || cleanName
    const sent = await sendEmail(cleanEmail, name, linkData.properties.action_link)
    if (!sent) return NextResponse.json({ error: 'فشل إرسال البريد.' }, { status: 500 })
    return NextResponse.json({ ok: true, resent: true })
  }

  // مستخدم جديد — توليد رابط تأكيد مباشرة
  const { data: newUser, error: createErr } = await admin.auth.admin.generateLink({
    type: 'signup',
    email: cleanEmail,
    password,
    options: {
      data:       { full_name: cleanName },
      redirectTo: `${appUrl}/auth/callback`,
    },
  })
  if (createErr) {
    console.error('[SIGNUP_ERROR]', createErr)
    return NextResponse.json({ error: 'حدث خطأ، حاول مرة أخرى.' }, { status: 500 })
  }

  const confirmLink = newUser?.properties?.action_link
  if (!confirmLink)
    return NextResponse.json({ error: 'فشل إنشاء رابط التأكيد.' }, { status: 500 })

  console.log('[CONFIRM_LINK]', confirmLink.slice(0, 80))

  const sent = await sendEmail(cleanEmail, cleanName, confirmLink)
  if (!sent) {
    if (newUser?.user?.id) await admin.auth.admin.deleteUser(newUser.user.id, false)
    return NextResponse.json({ error: 'فشل إرسال البريد.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
