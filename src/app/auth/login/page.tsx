'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (err) { setError('البريد الإلكتروني أو كلمة المرور غير صحيحة'); return }
    router.push('/dashboard/student'); router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{background:'var(--surface-2)'}}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center hero-bg">
        <div className="text-center relative z-10 p-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-6" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>م</div>
          <h2 className="text-4xl font-black text-white mb-4">مرحباً بعودتك</h2>
          <div className="gold-separator mb-6" />
          <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed">سجّل دخولك لمتابعة رحلتك التعليمية واستكشاف أحدث الدورات.</p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[['10,000+','طالب مسجّل'],['500+','دورة متاحة']].map(([v,l],i)=>(
              <div key={i} className="text-center p-4 rounded-xl" style={{background:'rgba(255,255,255,0.07)'}}>
                <div className="text-2xl font-black" style={{color:'var(--gold)'}}>{v}</div>
                <div className="text-xs text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>م</div>
              <span className="text-lg font-black" style={{color:'var(--text-primary)'}}>منصة <span className="gradient-text">تعلّم</span></span>
            </Link>
          </div>

          <div className="glass-card p-8 slide-up">
            <h1 className="text-2xl font-black mb-1" style={{color:'var(--text-primary)'}}>تسجيل الدخول</h1>
            <p className="text-sm mb-8" style={{color:'var(--text-secondary)'}}>أدخل بياناتك للمتابعة</p>

            {error && (
              <div className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm" style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca'}}>
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />} {...register('email')}
                error={errors.email?.message} dir="ltr" className="text-left" />
              <Input label="كلمة المرور" type="password" placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />} {...register('password')}
                error={errors.password?.message} dir="ltr" className="text-left" />

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-xs font-bold" style={{color:'var(--gold-dark)'}}>نسيت كلمة المرور؟</Link>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="btn-gold w-full py-3.5 rounded-lg font-black flex items-center justify-center gap-2">
                {isSubmitting && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{color:'var(--text-secondary)'}}>
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="font-black" style={{color:'var(--gold-dark)'}}>أنشئ حساباً</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
