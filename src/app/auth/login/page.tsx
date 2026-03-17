'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, AlertCircle, ArrowLeft, Users, BookOpen, Star } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('البريد غير صالح'),
  password: z.string().min(6,'6 أحرف على الأقل'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const [err, setErr] = useState<string|null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<Form>({ resolver:zodResolver(schema) })

  const onSubmit = async (d: Form) => {
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email:d.email, password:d.password })
    if (error) { setErr('البريد الإلكتروني أو كلمة المرور غير صحيحة'); return }
    router.push('/dashboard/student'); router.refresh()
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'var(--bg)'}}>
      {/* Left decorative */}
      <div className="hero-wrap" style={{flex:1,display:'none',alignItems:'center',justifyContent:'center',padding:48}} className="hidden lg:flex hero-wrap">
        <div style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,#b8912a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900,color:'#fff',margin:'0 auto 24px'}}>م</div>
          <h2 style={{fontSize:38,fontWeight:900,color:'#fff',marginBottom:12}}>مرحباً بعودتك</h2>
          <div className="gold-bar"/>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:15,maxWidth:280,margin:'18px auto',lineHeight:1.8}}>سجّل دخولك لمتابعة رحلتك التعليمية واستكشاف أحدث الدورات.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:260,margin:'32px auto 0'}}>
            {[['10K+','طالب مسجّل',Users],['500+','دورة متاحة',BookOpen],['4.9★','تقييم',Star],['+100','معلم',Users]].map(([v,l,Icon]:any,i)=>(
              <div key={i} style={{padding:'14px 12px',background:'rgba(255,255,255,.07)',borderRadius:12,textAlign:'center'}}>
                <div style={{fontSize:20,fontWeight:900,color:'var(--gold)'}}>{v}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
        <div style={{width:'100%',maxWidth:420}}>
          <div className="lg:hidden" style={{textAlign:'center',marginBottom:32}}>
            <Link href="/" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#b8912a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff'}}>م</div>
              <span style={{fontWeight:900,fontSize:17,color:'var(--txt1)'}}>منصة <span className="g-text">تعلّم</span></span>
            </Link>
          </div>

          <div className="card" style={{padding:32}}>
            <h1 style={{fontSize:24,fontWeight:900,marginBottom:4,color:'var(--txt1)'}}>تسجيل الدخول</h1>
            <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:28}}>أدخل بياناتك للمتابعة</p>

            {err && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',borderRadius:10,background:'#fef2f2',border:'1px solid #fecaca',marginBottom:20}}>
                <AlertCircle size={15} style={{color:'var(--red)',flexShrink:0}}/><p style={{fontSize:13,color:'var(--red)'}}>{err}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:16}}>
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com"
                leftIcon={<Mail size={16}/>} {...register('email')} error={errors.email?.message} dir="ltr"/>
              <Input label="كلمة المرور" type="password" placeholder="••••••••"
                leftIcon={<Lock size={16}/>} {...register('password')} error={errors.password?.message} dir="ltr"/>
              <div style={{textAlign:'left'}}>
                <Link href="/auth/forgot-password" style={{fontSize:12,fontWeight:700,color:'var(--gold)',textDecoration:'none'}}>نسيت كلمة المرور؟</Link>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-lg" style={{width:'100%',marginTop:4}}>
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>

            <p style={{textAlign:'center',fontSize:13,marginTop:20,color:'var(--txt2)'}}>
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" style={{fontWeight:800,color:'var(--gold)',textDecoration:'none'}}>أنشئ حساباً</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
