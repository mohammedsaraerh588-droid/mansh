'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [err,     setErr]     = useState<string|null>(null)
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) { setErr('تعذّر الإرسال. تأكد من البريد الإلكتروني.'); return }
    setSent(true)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'40px 24px'}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <Link href="/" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#b8912a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff',fontSize:16}}>م</div>
            <span style={{fontWeight:900,fontSize:17,color:'var(--txt1)'}}>منصة <span className="g-text">تعلّم</span></span>
          </Link>
        </div>

        <div className="card" style={{padding:32}}>
          {sent ? (
            <div style={{textAlign:'center',padding:'8px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <CheckCircle size={28} style={{color:'#16a34a'}}/>
              </div>
              <h2 style={{fontSize:21,fontWeight:900,marginBottom:8,color:'var(--txt1)'}}>تم الإرسال!</h2>
              <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24,lineHeight:1.7}}>
                أرسلنا رابط الاسترداد إلى <strong style={{color:'var(--txt1)'}}>{email}</strong>
              </p>
              <Link href="/auth/login" className="btn btn-gold btn-md" style={{textDecoration:'none',width:'100%',display:'flex',justifyContent:'center'}}>
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{fontSize:22,fontWeight:900,marginBottom:6,color:'var(--txt1)'}}>نسيت كلمة المرور؟</h1>
              <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24}}>أدخل بريدك وسنرسل لك رابط الاسترداد.</p>

              {err && (
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:'#fef2f2',border:'1px solid #fecaca',marginBottom:18}}>
                  <AlertCircle size={14} style={{color:'var(--red)'}}/><span style={{fontSize:13,color:'var(--red)'}}>{err}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>البريد الإلكتروني</label>
                  <div className="inp-wrap">
                    <span className="inp-icon left"><Mail size={15}/></span>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                      placeholder="name@example.com" className="inp inp-icon-l" dir="ltr"/>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-gold btn-lg" style={{width:'100%'}}>
                  {loading ? 'جاري الإرسال...' : 'إرسال رابط الاسترداد'}
                </button>
              </form>

              <div style={{textAlign:'center',marginTop:18}}>
                <Link href="/auth/login" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,color:'var(--gold)',textDecoration:'none'}}>
                  <ArrowRight size={14}/>العودة لتسجيل الدخول
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
