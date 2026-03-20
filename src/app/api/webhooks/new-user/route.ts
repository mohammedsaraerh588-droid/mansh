import { NextResponse } from 'next/server'

/* POST /api/webhooks/new-user
   يُستدعى من Supabase Auth Webhook عند تسجيل مستخدم جديد */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const record = body?.record || body?.user || {}
    const email  = record?.email
    const name   = record?.raw_user_meta_data?.full_name || record?.user_metadata?.full_name || email?.split('@')[0] || 'طالب'

    if (!email || !process.env.RESEND_API_KEY) return NextResponse.json({ ok: true })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    'منصة تعلّم الطبية <onboarding@resend.dev>',
        to:      email,
        subject: `مرحباً ${name} في منصة تعلّم الطبية 🏥`,
        html: buildWelcomeEmail(name),
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WELCOME_EMAIL]', err)
    return NextResponse.json({ ok: true })
  }
}

function buildWelcomeEmail(name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mansh-eta.vercel.app'
  const features = ['📚 مئات الدورات الطبية المتخصصة','🧪 اختبارات تفاعلية بعد كل درس','🏆 شهادات إتمام رقمية تلقائية','📊 تتبع تقدمك في التعلم']
  return `
<div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fafafa;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8">
  <div style="background:linear-gradient(135deg,#060608,#1a1040);padding:40px 32px;text-align:center">
    <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0">أهلاً ${name}! ⚕️</h1>
    <p style="color:rgba(255,255,255,.55);font-size:14px;margin:10px 0 0">مرحباً بك في منصة تعلّم الطبية</p>
  </div>
  <div style="padding:32px">
    <p style="color:#3D3D3D;font-size:14px;line-height:1.75;margin-bottom:20px">يسعدنا انضمامك! استكشف دوراتنا الطبية المتخصصة وابدأ رحلتك التعليمية.</p>
    ${features.map(f=>`<div style="padding:10px 14px;background:#f5f5f5;border-radius:8px;font-size:13px;color:#3D3D3D;margin-bottom:8px">${f}</div>`).join('')}
    <a href="${appUrl}/courses" style="display:block;text-align:center;background:#635BFF;color:#fff;padding:13px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-top:20px">ابدأ التعلم الآن →</a>
  </div>
  <div style="padding:14px 32px;border-top:1px solid #e8e8e8;text-align:center;font-size:11px;color:#A3A3A3">منصة تعلّم الطبية</div>
</div>`
}
