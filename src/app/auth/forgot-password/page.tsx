'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Mail, ArrowRight, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react'

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
    if (error) { setErr('تعذّر الإرسال. تأكد من البريد الإلكتروني وحاول مجدداً.'); return }
    setSent(true)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:13,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 4px 16px rgba(76,175,80,.4)'}}>
            <Stethoscope size={24} style={{color:'#fff'}}/>
          </div>
          <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:6}}>نسيت كلمة المرور؟</h1>
          <p style={{fontSize:14,color:'var(--tx3)'}}>أدخل بريدك وسنرسل لك رابط الاسترداد فوراً</p>
        </div>

        <div className="card" style={{padding:28}}>
          {sent ? (
            <div style={{textAlign:'center',padding:'8px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'var(--ok-bg)',border:'2px solid var(--ok-brd)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <CheckCircle size={28} style={{color:'var(--ok)'}}/>
              </div>
              <h2 style={{fontSize:20,fontWeight:900,marginBottom:8,color:'var(--tx1)'}}>تم الإرسال!</h2>
              <p style={{fontSize:13.5,color:'var(--tx2)',marginBottom:6,lineHeight:1.7}}>
                أرسلنا رابط الاسترداد إلى
              </p>
              <p style={{fontSize:14,fontWeight:700,color:'var(--tx1)',marginBottom:20}}>{email}</p>
              <p style={{fontSize:12,color:'var(--tx4)',marginBottom:20}}>
                لم تصل الرسالة؟ تحقق من مجلد Spam
              </p>
              <Link href="/auth/login" className="btn-register btn-full" style={{textDecoration:'none',justifyContent:'center',padding:'10px 0',display:'flex'}}>
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              {err && (
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:9,background:'var(--err-bg)',border:'1px solid var(--err-brd)',marginBottom:18}}>
                  <AlertCircle size={14} style={{color:'var(--err)',flexShrink:0}}/>
                  <span style={{fontSize:13,color:'var(--err)',fontWeight:600}}>{err}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--tx3)'}}>البريد الإلكتروني</label>
                  <div style={{position:'relative'}}>
                    <Mail size={15} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'var(--tx3)',pointerEvents:'none'}}/>
                    <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                      placeholder="name@example.com" dir="ltr"
                      style={{width:'100%',padding:'10px 40px 10px 14px',borderRadius:10,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-register btn-full" style={{justifyContent:'center',padding:'11px 0',fontSize:15}}>
                  {loading ? 'جاري الإرسال...' : 'إرسال رابط الاسترداد'}
                </button>
              </form>
              <div style={{textAlign:'center',marginTop:18}}>
                <Link href="/auth/login" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,color:'var(--alpha-green)',textDecoration:'none'}}>
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
