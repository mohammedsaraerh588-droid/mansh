'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'

const schema = z.object({
  fullName:        z.string().min(3,'الاسم 3 أحرف على الأقل'),
  email:           z.string().email('البريد غير صالح'),
  password:        z.string().min(6,'6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d=>d.password===d.confirmPassword,{message:'كلمات المرور غير متطابقة',path:['confirmPassword']})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const [err,     setErr]     = useState<string|null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<Form>({ resolver:zodResolver(schema) })

  const onSubmit = async (d: Form) => {
    setErr(null)
    const { error } = await supabase.auth.signUp({ email:d.email, password:d.password, options:{ data:{ full_name:d.fullName } } })
    if (error) { setErr(error.message.includes('already registered')?'هذا البريد مسجّل مسبقاً.':'حدث خطأ، حاول مرة أخرى.'); return }
    setSuccess(true)
    setTimeout(()=>{ router.push('/dashboard/student'); router.refresh() }, 1800)
  }

  if (success) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div className="card" style={{padding:40,textAlign:'center',maxWidth:360,width:'100%'}}>
        <div style={{width:64,height:64,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <CheckCircle size={32} style={{color:'#16a34a'}}/>
        </div>
        <h2 style={{fontSize:22,fontWeight:900,marginBottom:8,color:'var(--txt1)'}}>تم التسجيل بنجاح!</h2>
        <p style={{fontSize:14,color:'var(--txt2)'}}>جاري توجيهك للوحة التحكم...</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Decorative */}
      <div className="hero-wrap hidden lg:flex" style={{flex:1,alignItems:'center',justifyContent:'center',padding:48}}>
        <div style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#b8912a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900,color:'#fff',margin:'0 auto 24px'}}>م</div>
          <h2 style={{fontSize:36,fontWeight:900,color:'#fff',marginBottom:12}}>انضم إلينا اليوم</h2>
          <div className="gold-bar"/>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:15,maxWidth:280,margin:'18px auto',lineHeight:1.8}}>أنشئ حسابك مجاناً وابدأ رحلتك نحو الاحتراف.</p>
          <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:260,margin:'28px auto 0',textAlign:'right'}}>
            {['شهادات رقمية معتمدة','وصول مدى الحياة للمحتوى','دعم متخصص على مدار الساعة'].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,fontSize:14,color:'rgba(255,255,255,.6)'}}>
                <CheckCircle size={15} style={{color:'var(--gold)',flexShrink:0}}/>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{width:'100%',maxWidth:420}}>
          <div className="card" style={{padding:32}}>
            <h1 style={{fontSize:24,fontWeight:900,marginBottom:4,color:'var(--txt1)'}}>إنشاء حساب جديد</h1>
            <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:24}}>انضم لآلاف المتعلمين مجاناً</p>

            {err && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',borderRadius:10,background:'#fef2f2',border:'1px solid #fecaca',marginBottom:18}}>
                <AlertCircle size={15} style={{color:'var(--red)',flexShrink:0}}/><p style={{fontSize:13,color:'var(--red)'}}>{err}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:14}}>
              <Input label="الاسم الكامل" placeholder="أحمد محمد" leftIcon={<User size={15}/>} {...register('fullName')} error={errors.fullName?.message}/>
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com" leftIcon={<Mail size={15}/>} {...register('email')} error={errors.email?.message} dir="ltr"/>
              <Input label="كلمة المرور" type="password" placeholder="••••••••" leftIcon={<Lock size={15}/>} {...register('password')} error={errors.password?.message} dir="ltr"/>
              <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••••" leftIcon={<Lock size={15}/>} {...register('confirmPassword')} error={errors.confirmPassword?.message} dir="ltr"/>
              <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-lg" style={{width:'100%',marginTop:6}}>
                {isSubmitting ? 'جاري التسجيل...' : 'إنشاء الحساب'}
              </button>
            </form>

            <p style={{textAlign:'center',fontSize:13,marginTop:18,color:'var(--txt2)'}}>
              لديك حساب؟{' '}<Link href="/auth/login" style={{fontWeight:800,color:'var(--gold)',textDecoration:'none'}}>سجّل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
