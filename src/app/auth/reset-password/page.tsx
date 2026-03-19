'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Lock, CheckCircle, AlertCircle, Loader2, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [err,       setErr]       = useState('')
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    let mounted = true
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && mounted) {
        // session ready for password reset
      }
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && mounted) {
        // session exists
      }
    })
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (password.length < 6) { setErr('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    if (password !== confirm) { setErr('كلمتا المرور غير متطابقتين'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setErr('فشل تحديث كلمة المرور. حاول مرة أخرى.'); return }
    setDone(true)
    setTimeout(() => router.push('/auth/login'), 2500)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'40px 20px'}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <Link href="/" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
              <Stethoscope size={18}/>
            </div>
            <span style={{fontWeight:900,fontSize:17,color:'var(--txt1)'}}>منصة تعلّم الطبية</span>
          </Link>
        </div>

        <div className="card" style={{padding:32}}>
          {done ? (
            <div style={{textAlign:'center',padding:'8px 0'}}>
              <div style={{width:60,height:60,borderRadius:'50%',background:'var(--ok-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                <CheckCircle size={28} style={{color:'var(--ok)'}}/>
              </div>
              <h2 style={{fontSize:20,fontWeight:900,marginBottom:8,color:'var(--txt1)'}}>تم تحديث كلمة المرور!</h2>
              <p style={{fontSize:14,color:'var(--txt2)'}}>سيتم توجيهك لصفحة تسجيل الدخول...</p>
            </div>
          ) : (
            <>
              <h1 style={{fontSize:22,fontWeight:900,marginBottom:6,color:'var(--txt1)'}}>إعادة تعيين كلمة المرور</h1>
              <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24}}>أدخل كلمة مرور جديدة لحسابك.</p>

              {err && (
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)',marginBottom:16}}>
                  <AlertCircle size={14} style={{color:'var(--err)',flexShrink:0}}/>
                  <span style={{fontSize:13,color:'var(--err)'}}>{err}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>كلمة المرور الجديدة</label>
                  <div className="inp-wrap">
                    <span className="inp-icon l"><Lock size={14}/></span>
                    <input type="password" className="inp inp-icon-l" placeholder="••••••••" dir="ltr"
                      value={password} onChange={e=>setPassword(e.target.value)} required/>
                  </div>
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>تأكيد كلمة المرور</label>
                  <div className="inp-wrap">
                    <span className="inp-icon l"><Lock size={14}/></span>
                    <input type="password" className="inp inp-icon-l" placeholder="••••••••" dir="ltr"
                      value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{marginTop:4}}>
                  {loading ? <><Loader2 size={15} className="spin"/>جاري التحديث...</> : 'تحديث كلمة المرور'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
