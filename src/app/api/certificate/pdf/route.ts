import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const certId = searchParams.get('certId')
    if (!certId) return NextResponse.json({ error: 'certId required' }, { status: 400 })

    const supabase = await createSupabaseServerClient()
    const { data: cert, error } = await supabase.from('certificates').select('*').eq('id', certId).single()
    if (error || !cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const issued = new Date(cert.issued_at).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Tajawal',serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}
.cert{width:900px;height:640px;border:2px solid #1B5E20;position:relative;overflow:hidden;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:50px 60px}
.cert::before{content:'';position:absolute;inset:12px;border:1px solid #4CAF50;opacity:.25;pointer-events:none}
.corner{position:absolute;width:56px;height:56px;border-color:#4CAF50;border-style:solid;opacity:.5}
.tl{top:8px;right:8px;border-width:3px 0 0 3px}.tr{top:8px;left:8px;border-width:3px 3px 0 0}
.bl{bottom:8px;right:8px;border-width:0 0 3px 3px}.br{bottom:8px;left:8px;border-width:0 3px 3px 0}
.wm{position:absolute;font-size:100px;font-weight:900;color:rgba(76,175,80,.04);top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);white-space:nowrap;pointer-events:none}
.logo-row{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.logo-icon{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#4CAF50,#2E7D32);display:flex;align-items:center;justify-content:center}
.logo-name{font-size:17px;font-weight:900;color:#1A1A2E}
.divider{width:70px;height:3px;background:linear-gradient(90deg,#4CAF50,#81C784);border-radius:99px;margin:4px auto}
.cert-title{font-size:12px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#388E3C}
.awarded{font-size:14px;color:#6B7280}
.student-name{font-size:36px;font-weight:900;color:#1A1A2E;letter-spacing:-.02em;text-align:center;border-bottom:2px solid #4CAF50;padding-bottom:8px;min-width:280px}
.completed-text{font-size:13px;color:#6B7280}
.course-name{font-size:20px;font-weight:800;color:#1A1A2E;text-align:center}
.meta-row{display:flex;gap:48px;align-items:center;margin-top:12px}
.meta-item{text-align:center}
.meta-label{font-size:10px;color:#9CA3AF;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}
.meta-value{font-size:13px;font-weight:700;color:#374151}
.cert-number{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:9px;color:#9CA3AF;letter-spacing:.1em}
</style>
</head>
<body>
<div class="cert">
  <div class="wm">MEDLEARN</div>
  <div class="corner tl"/><div class="corner tr"/><div class="corner bl"/><div class="corner br"/>
  <div class="logo-row">
    <div class="logo-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
    <span class="logo-name">منصة تعلّم الطبية</span>
  </div>
  <div class="divider"></div>
  <div class="cert-title">شهادة إتمام دورة</div>
  <div class="awarded">تُمنح هذه الشهادة لـ</div>
  <div class="student-name">${cert.student_name}</div>
  <div class="completed-text">لإتمامه بنجاح دورة</div>
  <div class="course-name">${cert.course_title}</div>
  <div class="meta-row">
    <div class="meta-item"><div class="meta-label">المعلم</div><div class="meta-value">${cert.teacher_name}</div></div>
    <div style="width:1px;height:36px;background:#E5E7EB;margin:0"></div>
    <div class="meta-item"><div class="meta-label">تاريخ الإصدار</div><div class="meta-value">${issued}</div></div>
    <div style="width:1px;height:36px;background:#E5E7EB;margin:0"></div>
    <div class="meta-item"><div class="meta-label">الدرجة</div><div class="meta-value" style="color:#16A34A">ممتاز ✓</div></div>
  </div>
  <div class="cert-number">${cert.certificate_number}</div>
</div>
<script>window.onload=()=>window.print()</script>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (err: unknown) {
    console.error('[CERT_PDF]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
