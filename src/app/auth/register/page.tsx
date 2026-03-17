'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

const registerSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setError(null)
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message.includes('User already registered') 
        ? 'هذا البريد الإلكتروني مسجل مسبقاً.' 
        : 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.')
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/dashboard/student')
      router.refresh()
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-surface relative overflow-hidden">
        <div className="w-full max-w-md relative z-10 glass-card p-10 text-center scale-in">
          <div className="w-20 h-20 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">تم إنشاء الحساب بنجاح!</h2>
          <p className="text-text-secondary">جاري توجيهك إلى لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 glass-card p-8 slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
          <p className="text-text-secondary">انضم لآلاف المتعلمين اليوم</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="الاسم الكامل"
            placeholder="أحمد محمد"
            leftIcon={<User className="w-5 h-5" />}
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            {...register('email')}
            error={errors.email?.message}
            dir="ltr"
            className="text-left"
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            {...register('password')}
            error={errors.password?.message}
            dir="ltr"
            className="text-left"
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            dir="ltr"
            className="text-left"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg mt-4 shadow-primary/20"
            isLoading={isSubmitting}
          >
            إنشاء حساب
          </Button>
        </form>

        <div className="text-center mt-8 text-sm">
          <span className="text-text-secondary">لديك حساب بالفعل؟ </span>
          <Link href="/auth/login" className="text-primary-light font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}
