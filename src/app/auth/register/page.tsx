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
  password:        z.string().min(6,'كلمة المرور 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message:'كلمات المرور غير متطابقة', path:['confirmPassword'] })
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    setError(null)
    const { error: err } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { data: { full_name: data.fullName } },
    })
    if (err) { setError(err.message.includes('already registered') ? 'هذا البريد مسجّل مسبقاً.' : 'حدث خطأ، حاول مرة أخرى.'); return }
    setSuccess(true)
    setTimeout(() => { router.push('/dashboard/student'); router.refresh() }, 2000)
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-2)'}}>
      <div className="glass-card p-10 text-center w-full max-w-sm scale-in">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'#d1fae5'}}>
          <CheckCircle className="w-8 h-8" style={{color:'#059669'}} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{color:'var(--text-primary)'}}>تم التسجيل بنجاح!</h2>
        <p className="text-sm" style={{color:'var(--text-secondary)'}}>جاري توجيهك للوحة التحكم...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{background:'var(--surface-2)'}}>
      {/* Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center hero-bg">
        <div className="text-center relative z-10 p-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-6" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>م</div>
          <h2 className="text-4xl font-black text-white mb-4">انضم إلينا اليوم</h2>
          <div className="gold-separator mb-6" />
          <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed">أنشئ حسابك مجاناً وابدأ رحلتك نحو الاحتراف مع أفضل الدورات العربية.</p>
          <div className="mt-10 space-y-3 max-w-xs mx-auto">
            {['شهادات رقمية معتمدة','وصول مدى الحياة للمحتوى','دعم متخصص على مدار الساعة'].map((t,i)=>(
              <div key={i} className="flex items-center gap-3 text-sm" style={{color:'rgba(255,255,255,0.65)'}}>
                <CheckCircle className="w-4 h-4 shrink-0" style={{color:'var(--gold)'}} />{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>م</div>
              <span className="text-lg font-black gradient-text-dark">منصة تعلّم</span>
            </Link>
          </div>

          <div className="glass-card p-8 slide-up">
            <h1 className="text-2xl font-black mb-1" style={{color:'var(--text-primary)'}}>إنشاء حساب جديد</h1>
            <p className="text-sm mb-8" style={{color:'var(--text-secondary)'}}>انضم لآلاف المتعلمين مجاناً</p>

            {error && (
              <div className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm" style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca'}}>
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="الاسم الكامل" placeholder="أحمد محمد" leftIcon={<User className="w-4 h-4" />}
                {...register('fullName')} error={errors.fullName?.message} />
              <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />} {...register('email')}
                error={errors.email?.message} dir="ltr" className="text-left" />
              <Input label="كلمة المرور" type="password" placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />} {...register('password')}
                error={errors.password?.message} dir="ltr" className="text-left" />
              <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />} {...register('confirmPassword')}
                error={errors.confirmPassword?.message} dir="ltr" className="text-left" />

              <button type="submit" disabled={isSubmitting}
                className="btn-gold w-full py-3.5 rounded-lg font-black flex items-center justify-center gap-2 mt-2">
                {isSubmitting && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {isSubmitting ? 'جاري التسجيل...' : 'إنشاء الحساب'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{color:'var(--text-secondary)'}}>
              لديك حساب؟{' '}
              <Link href="/auth/login" className="font-black" style={{color:'var(--gold-dark)'}}>سجّل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
