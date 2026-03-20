import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/* GET /api/certificate/pdf?certId=xxx
   يولّد HTML جاهز للطباعة كـ PDF */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const certId = searchParams.get('certId')
  if (!certId) return NextResponse.json({ error: 'certId required' }, { status: 400 })

  const supabase = await createSupabaseServerClient()
  const { data: cert } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', certId)
    .single()

  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const issued = new Date(cert.issued_at).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box }
  body {
    font-family: 'Tajawal', serif;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
  }
  .cert {
    width: 900px; height: 640px;
    border: 2px solid #1a1a2e;
    position: relative;
    overflow: hidden;
    background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px;
    padding: 50px 60px;
  }
  .cert::before {
    content: '';
    position: absolute; inset: 12px;
    border: 1px solid #635BFF; opacity: .3;
    pointer-events: none;
  }
  .corner {
    position: absolute; width: 60px; height: 60px;
    border-color: #635BFF; border-style: solid; opacity: .6;
  }
  .corner.tl { top:8px; right:8px; border-width:3px 0 0 3px; border-radius: 0 0 0 4px }
  .corner.tr { top:8px; left:8px;  border-width:3px 3px 0 0; border-radius: 0 0 4px 0 }
  .corner.bl { bottom:8px; right:8px; border-width:0 0 3px 3px; border-radius: 4px 0 0 0 }
  .corner.br { bottom:8px; left:8px;  border-width:0 3px 3px 0; border-radius: 0 4px 0 0 }
  .watermark {
    position: absolute; font-size: 120px; font-weight: 900;
    color: rgba(99,91,255,.04); top: 50%; left: 50%;
    transform: translate(-50%,-50%) rotate(-30deg);
    white-space: nowrap; pointer-events: none;
  }
  .logo-row { display:flex; align-items:center; gap:10px; margin-bottom:4px }
  .logo-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg,#635BFF,#4F46E5);
    display: flex; align-items: center; justify-content: center;
  }
  .logo-icon svg { width:22px; height:22px }
  .logo-name { font-size:18px; font-weight:900; color:#0A0A0A; letter-spacing:-.02em }
  .divider { width:80px; height:3px; background:linear-gradient(90deg,#635BFF,#0EA5E9); border-radius:99px; margin:4px auto }
  .cert-title { font-size:13px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#635BFF }
  .awarded { font-size:15px; color:#737373; font-weight:500 }
  .student-name { font-size:38px; font-weight:900; color:#0A0A0A; letter-spacing:-.02em; text-align:center; border-bottom:2px solid #635BFF; padding-bottom:8px; min-width:300px }
  .completed-text { font-size:14px; color:#737373 }
  .course-name { font-size:22px; font-weight:800; color:#0A0A0A; text-align:center; letter-spacing:-.01em }
  .meta-row { display:flex; gap:60px; align-items:center; margin-top:16px }
  .meta-item { text-align:center }
  .meta-label { font-size:11px; color:#A3A3A3; font-weight:600; letter-spacing:.08em; text-transform:uppercase; margin-bottom:4px }
  .meta-value { font-size:13px; font-weight:700; color:#3D3D3D }
  .cert-number { position:absolute; bottom:16px; left:50%; transform:translateX(-50%); font-size:10px; color:#A3A3A3; letter-spacing:.1em }
</style>
</head>
<body>
<div class="cert">
  <div class="watermark">MEDLEARN</div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>

  <div class="logo-row">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    </div>
    <span class="logo-name">منصة تعلّم الطبية</span>
  </div>

  <div class="divider"></div>
  <div class="cert-title">شهادة إتمام دورة</div>
  <div class="awarded">تُمنح هذه الشهادة لـ</div>
  <div class="student-name">${cert.student_name}</div>
  <div class="completed-text">لإتمامه بنجاح دورة</div>
  <div class="course-name">${cert.course_title}</div>

  <div class="meta-row">
    <div class="meta-item">
      <div class="meta-label">المعلم</div>
      <div class="meta-value">${cert.teacher_name}</div>
    </div>
    <div class="divider" style="width:1px;height:40px;background:#E8E8E8;margin:0"></div>
    <div class="meta-item">
      <div class="meta-label">تاريخ الإصدار</div>
      <div class="meta-value">${issued}</div>
    </div>
    <div class="divider" style="width:1px;height:40px;background:#E8E8E8;margin:0"></div>
    <div class="meta-item">
      <div class="meta-label">الدرجة</div>
      <div class="meta-value" style="color:#16A34A">ممتاز ✓</div>
    </div>
  </div>

  <div class="cert-number">${cert.certificate_number}</div>
</div>
<script>window.onload = () => window.print()</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
