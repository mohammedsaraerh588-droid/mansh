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
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setErr('البريد الإلكتروني أو كلمة المرور غير صحيحة'); return }
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: p } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      const role = p?.role || 'student'
      router.push(role === 'admin' ? '/dashboard/admin' : role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student')
      router.refresh()
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px'}}>
      <div style={{width:'100%', maxWidth:420}}>
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{width:52, height:52, borderRadius:13, background:'var(--alpha-green)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 4px 16px rgba(76,175,80,.4)'}}>
            <Stethoscope size={24} style={{color:'#fff'}}/>
          </div>
          <h1 style={{fontSize:24, fontWeight:900, color:'var(--tx1)', marginBottom:6, letterSpacing:'-.02em'}}>تسجيل الدخول</h1>
          <p style={{fontSize:14, color:'var(--tx3)'}}>أهلاً بعودتك إلى منصة تعلّم الطبية</p>
        </div>

        <div className="card" style={{padding:28}}>
          {err && (
            <div style={{display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:9, background:'var(--err-bg)', border:'1px solid var(--err-brd)', marginBottom:18}}>
              <AlertCircle size={15} style={{color:'var(--err)', flexShrink:0}}/>
              <span style={{fontSize:13, color:'var(--err)', fontWeight:600}}>{err}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:16}}>
            <Input label="البريد الإلكتروني" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={15}/>} placeholder="example@email.com"
              dir="ltr" required/>
            <Input label="كلمة المرور" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={15}/>} placeholder="••••••••"
              dir="ltr" required/>
            <Link href="/auth/forgot-password" style={{fontSize:13, color:'var(--alpha-green)', fontWeight:600, textAlign:'left', display:'block', marginTop:-8}}>
              نسيت كلمة المرور؟
            </Link>
            <button type="submit" disabled={loading} className="btn-register btn-full" style={{marginTop:4, justifyContent:'center'}}>
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
          <div style={{textAlign:'center', marginTop:20, fontSize:13, color:'var(--tx3)'}}>
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" style={{color:'var(--alpha-green)', fontWeight:700}}>إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
