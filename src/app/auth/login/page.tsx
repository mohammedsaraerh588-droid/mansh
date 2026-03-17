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
import { Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (signInError) {
      setError(signInError.message.includes('Invalid login credentials') 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
        : 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.')
      return
    }

    router.push('/dashboard/student')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 glass-card p-8 scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white font-bold text-2xl mb-4 shadow-lg">
            م
          </Link>
          <h1 className="text-2xl font-bold mb-2">مرحباً بعودتك</h1>
          <p className="text-text-secondary">سجل دخولك لمتابعة رحلة التعلم</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg mt-2 shadow-primary/20"
            isLoading={isSubmitting}
          >
            تسجيل الدخول
          </Button>
        </form>

        <div className="text-center mt-8 text-sm">
          <span className="text-text-secondary">ليس لديك حساب؟ </span>
          <Link href="/auth/register" className="text-primary-light font-bold hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </div>
      </div>
    </div>
  )
}
