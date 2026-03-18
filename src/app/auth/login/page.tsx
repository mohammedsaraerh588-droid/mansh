'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, AlertCircle, Stethoscope } from 'lucide-react'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [err,      setErr]      = useState('')
  const [loading,  setLoading]  = useState(false)
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setErr('البريد الإلكتروني أو كلمة المرور غير صحيحة'); return }
    // redirect based on role
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: p } = await supabase.from('profiles').select('role').eq('id',session.user.id).single()
      const role = p?.role || 'student'
      router.push(role==='admin'?'/dashboard/admin':role==='teacher'?'/dashboard/teacher':'/dashboard/student')
      router.refresh()
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Decorative side */}
      <div className="hero hidden lg:flex" style={{flex:1,position:'relative',alignItems:'center',justifyContent:'center'}}>
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',padding:48,textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:22,boxShadow:'var(--st)'}}>
            <Stethoscope size={28} style={{color:'#fff'}}/>
          </div>
          <h2 style={{fontSize:34,fontWeight:900,color:'#fff',marginBottom:10}}>مرحباً بعودتك</h2>
          <div style={{width:40,height:3,background:'var(--teal)',borderRadius:2,margin:'0 auto 18px'}}/>
          <p style={{color:'rgba(255,255,255,.52)',fontSize:15,maxWidth:280,lineHeight:1.8}}>سجّل دخولك لمتابعة رحلتك التعليمية الطبية.</p>
        </div>
      </div>

      {/* Form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{width:'100%',maxWidth:420}}>
          {/* Mobile logo */}
          <div style={{textAlign:'center',marginBottom:28}} className="lg:hidden">
            <Link href="/" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
                <Stethoscope size={16}/>
              </div>
              <span style={{fontWeight:900,fontSize:16,color:'var(--txt1)'}}>منصة تعلّم الطبية</span>
            </Link>
          </div>

          <div className="card" style={{padding:32}}>
            <h1 style={{fontSize:23,fontWeight:900,marginBottom:4,color:'var(--txt1)'}}>تسجيل الدخول</h1>
            <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24}}>أدخل بياناتك للمتابعة</p>

            {err && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)',marginBottom:18}}>
                <AlertCircle size={14} style={{color:'var(--err)',flexShrink:0}}/>
                <span style={{fontSize:13,color:'var(--err)'}}>{err}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com"
                leftIcon={<Mail size={15}/>} value={email} onChange={e=>setEmail(e.target.value)} required dir="ltr"/>
              <Input label="كلمة المرور" type="password" placeholder="••••••••"
                leftIcon={<Lock size={15}/>} value={password} onChange={e=>setPassword(e.target.value)} required dir="ltr"/>
              <div style={{textAlign:'left',marginTop:-4}}>
                <Link href="/auth/forgot-password" style={{fontSize:12,fontWeight:700,color:'var(--teal)',textDecoration:'none'}}>
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{marginTop:4}}>
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>

            <p style={{textAlign:'center',fontSize:13,marginTop:20,color:'var(--txt2)'}}>
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" style={{fontWeight:800,color:'var(--teal)',textDecoration:'none'}}>أنشئ حساباً مجاناً</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
