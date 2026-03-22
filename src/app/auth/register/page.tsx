'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle, CheckCircle, Stethoscope } from 'lucide-react'

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' })
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (form.name.trim().length < 3)         { setErr('الاسم يجب أن يكون 3 أحرف على الأقل'); return }
    if (form.password.length < 6)            { setErr('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return }
    if (form.password !== form.confirm)      { setErr('كلمتا المرور غير متطابقتين'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email:   form.email,
      password: form.password,
      options:  { data: { full_name: form.name.trim() } },
    })
    setLoading(false)
    if (error) {
      setErr(error.message.includes('already')
        ? 'هذا البريد الإلكتروني مسجّل بالفعل.'
        : 'حدث خطأ. يرجى المحاولة مرة أخرى.')
      return
    }
    // ⚠️ مهم: نُسجّل خروج فوراً لمنع الدخول قبل تأكيد البريد
    await supabase.auth.signOut()
    setSuccess(true)
  }

  // ✅ تم التسجيل — انتظر تأكيد البريد
  if (success) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:420,textAlign:'center'}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--ok-bg)',border:'2px solid var(--ok-brd)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <Mail size={32} style={{color:'var(--ok)'}}/>
        </div>
        <h2 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:10,letterSpacing:'-.02em'}}>
          تحقق من بريدك الإلكتروني ✉️
        </h2>
        <p style={{fontSize:15,color:'var(--tx3)',lineHeight:1.85,marginBottom:8}}>
          أرسلنا رابط تأكيد إلى
        </p>
        <p style={{fontSize:15,fontWeight:700,color:'var(--tx1)',marginBottom:20}}>
          {form.email}
        </p>
        <div className="card" style={{padding:'16px 20px',marginBottom:24,textAlign:'right'}}>
          {['افتح بريدك الإلكتروني','ابحث عن رسالة من منصة تعلّم','اضغط على رابط "تأكيد البريد"','ستنتقل تلقائياً للمنصة'].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<3?10:0}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:'var(--alpha-green)',color:'#fff',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:13,color:'var(--tx2)'}}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:'var(--tx4)',marginBottom:16}}>
          لم تصل الرسالة؟ تحقق من مجلد Spam أو انتظر دقيقة
        </p>
        <Link href="/auth/login" style={{fontSize:13,color:'var(--alpha-green)',fontWeight:700,textDecoration:'none'}}>
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:13,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 4px 16px rgba(76,175,80,.4)'}}>
            <Stethoscope size={24} style={{color:'#fff'}}/>
          </div>
          <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:6,letterSpacing:'-.02em'}}>إنشاء حساب جديد</h1>
          <p style={{fontSize:14,color:'var(--tx3)'}}>انضم لمنصة تعلّم الطبية مجاناً</p>
        </div>

        <div className="card" style={{padding:28}}>
          {err && (
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:9,background:'var(--err-bg)',border:'1px solid var(--err-brd)',marginBottom:18}}>
              <AlertCircle size={15} style={{color:'var(--err)',flexShrink:0}}/>
              <span style={{fontSize:13,color:'var(--err)',fontWeight:600}}>{err}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:15}}>
            <Input label="الاسم الكامل" type="text" required
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              leftIcon={<User size={15}/>} placeholder="محمد أحمد"/>
            <Input label="البريد الإلكتروني" type="email" required dir="ltr"
              value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              leftIcon={<Mail size={15}/>} placeholder="name@example.com"/>
            <Input label="كلمة المرور" type="password" required dir="ltr"
              value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              leftIcon={<Lock size={15}/>} placeholder="6 أحرف على الأقل"/>
            <Input label="تأكيد كلمة المرور" type="password" required dir="ltr"
              value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}
              leftIcon={<Lock size={15}/>} placeholder="أعد كتابة كلمة المرور"/>

            <button type="submit" disabled={loading} className="btn-register btn-full" style={{justifyContent:'center',padding:'12px 0',marginTop:4,fontSize:15}}>
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب مجاني'}
            </button>
          </form>

          <div style={{textAlign:'center',marginTop:20,fontSize:13,color:'var(--tx3)'}}>
            لديك حساب؟{' '}
            <Link href="/auth/login" style={{color:'var(--alpha-green)',fontWeight:700,textDecoration:'none'}}>تسجيل الدخول</Link>
          </div>
        </div>

        <p style={{textAlign:'center',fontSize:11,color:'var(--tx4)',marginTop:16,lineHeight:1.7}}>
          بإنشاء حساب فأنت توافق على{' '}
          <Link href="/terms" style={{color:'var(--tx3)'}}>الشروط والأحكام</Link>
          {' '}و{' '}
          <Link href="/privacy" style={{color:'var(--tx3)'}}>سياسة الخصوصية</Link>
        </p>
      </div>
    </div>
  )
}
