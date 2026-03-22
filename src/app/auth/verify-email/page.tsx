'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Mail, CheckCircle, RefreshCw, LogOut } from 'lucide-react'

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false)
  const [resent,    setResent]    = useState(false)
  const [email,     setEmail]     = useState('')
  const supabase = createSupabaseBrowserClient()

  const resend = async () => {
    if (!email.trim()) return
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'24px'}}>
      <div style={{maxWidth:440,width:'100%',textAlign:'center'}}>

        <div style={{width:76,height:76,borderRadius:'50%',background:'var(--alpha-green-l)',border:'2px solid var(--alpha-green-m)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
          <Mail size={34} style={{color:'var(--alpha-green)'}}/>
        </div>

        <h1 style={{fontSize:26,fontWeight:900,color:'var(--tx1)',marginBottom:10,letterSpacing:'-.02em'}}>
          أكّد بريدك الإلكتروني
        </h1>
        <p style={{fontSize:15,color:'var(--tx3)',lineHeight:1.85,marginBottom:28}}>
          أرسلنا لك رابط تأكيد على بريدك الإلكتروني.
          يرجى فتحه والضغط على الرابط للمتابعة.
        </p>

        <div className="card" style={{padding:'20px 24px',marginBottom:20,textAlign:'right'}}>
          {['افتح تطبيق البريد الإلكتروني','ابحث عن رسالة من منصة تعلّم','اضغط على "تأكيد البريد الإلكتروني"'].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<2?12:0}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:'var(--alpha-green)',color:'#fff',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:13,color:'var(--tx2)'}}>{t}</span>
            </div>
          ))}
        </div>

        {/* إعادة إرسال */}
        <div style={{marginBottom:16}}>
          <p style={{fontSize:13,color:'var(--tx3)',marginBottom:10}}>لم تصل الرسالة؟</p>
          <div style={{display:'flex',gap:8,maxWidth:320,margin:'0 auto'}}>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="أدخل بريدك هنا"
              dir="ltr"
              style={{flex:1,padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
            <button onClick={resend} disabled={resending || resent}
              className="btn-register btn-sm"
              style={{padding:'9px 14px',fontSize:12,borderRadius:9}}>
              {resending ? <RefreshCw size={13} className="spin"/> : resent ? <CheckCircle size={13}/> : 'أعد الإرسال'}
            </button>
          </div>
          {resent && <p style={{fontSize:12,color:'var(--ok)',marginTop:8}}>✓ تم الإرسال! تحقق من بريدك</p>}
        </div>

        <button onClick={logout} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:'var(--tx3)',display:'flex',alignItems:'center',gap:5,margin:'0 auto',fontFamily:'inherit'}}>
          <LogOut size={13}/>تسجيل خروج والرجوع لصفحة الدخول
        </button>
      </div>
    </div>
  )
}
