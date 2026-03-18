'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle, CheckCircle, Stethoscope } from 'lucide-react'

export default function RegisterPage() {
  const [form,     setForm]     = useState({ name:'', email:'', password:'', confirm:'' })
  const [err,      setErr]      = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (form.name.trim().length < 3) { setErr('الاسم 3 أحرف على الأقل'); return }
    if (form.password.length < 6)    { setErr('كلمة المرور 6 أحرف على الأقل'); return }
    if (form.password !== form.confirm){ setErr('كلمتا المرور غير متطابقتين'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name.trim() } }
    })
    setLoading(false)
    if (error) { setErr(error.message.includes('already') ? 'هذا البريد مسجّل مسبقاً.' : 'حدث خطأ. حاول مرة أخرى.'); return }
    setSuccess(true)
    setTimeout(() => { router.push('/dashboard/student'); router.refresh() }, 1800)
  }

  if (success) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div className="card" style={{padding:40,textAlign:'center',maxWidth:360,width:'100%'}}>
        <div style={{width:60,height:60,borderRadius:'50%',background:'var(--ok-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <CheckCircle size={28} style={{color:'var(--ok)'}}/>
        </div>
        <h2 style={{fontSize:21,fontWeight:900,marginBottom:8,color:'var(--txt1)'}}>تم التسجيل بنجاح!</h2>
        <p style={{fontSize:14,color:'var(--txt2)'}}>جاري توجيهك للوحة التحكم...</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Decorative */}
      <div className="hero hidden lg:flex" style={{flex:1,alignItems:'center',justifyContent:'center',padding:48}}>
        <div style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{width:60,height:60,borderRadius:16,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'var(--st)'}}>
            <Stethoscope size={28} style={{color:'#fff'}}/>
          </div>
          <h2 style={{fontSize:34,fontWeight:900,color:'#fff',marginBottom:10}}>انضم إلى المجتمع الطبي</h2>
          <div style={{width:40,height:3,background:'var(--teal)',borderRadius:2,margin:'0 auto 18px'}}/>
          <p style={{color:'rgba(255,255,255,.52)',fontSize:15,maxWidth:280,margin:'0 auto',lineHeight:1.8}}>أنشئ حسابك مجاناً وابدأ رحلتك في التعلم الطبي.</p>
          <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:260,margin:'24px auto 0',textAlign:'right'}}>
            {['محتوى علمي دقيق','شهادات إتمام رقمية','اختبارات تفاعلية'].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'rgba(255,255,255,.55)'}}>
                <CheckCircle size={13} style={{color:'var(--teal)',flexShrink:0}}/>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{width:'100%',maxWidth:420}}>
          <div className="card" style={{padding:32}}>
            <h1 style={{fontSize:23,fontWeight:900,marginBottom:4,color:'var(--txt1)'}}>إنشاء حساب جديد</h1>
            <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24}}>انضم مجاناً وابدأ التعلم الآن</p>
            {err && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)',marginBottom:18}}>
                <AlertCircle size={14} style={{color:'var(--err)',flexShrink:0}}/><span style={{fontSize:13,color:'var(--err)'}}>{err}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:13}}>
              <Input label="الاسم الكامل" placeholder="أحمد محمد" leftIcon={<User size={14}/>}
                value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com" leftIcon={<Mail size={14}/>}
                value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required dir="ltr"/>
              <Input label="كلمة المرور" type="password" placeholder="••••••••" leftIcon={<Lock size={14}/>}
                value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required dir="ltr"/>
              <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••••" leftIcon={<Lock size={14}/>}
                value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required dir="ltr"/>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{marginTop:4}}>
                {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
              </button>
            </form>
            <p style={{textAlign:'center',fontSize:13,marginTop:18,color:'var(--txt2)'}}>
              لديك حساب؟{' '}
              <Link href="/auth/login" style={{fontWeight:800,color:'var(--teal)',textDecoration:'none'}}>سجّل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
