'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Category } from '@/types'
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react'

const courseSchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  titleAr: z.string().optional(),
  categoryId: z.string().min(1, 'يرجى اختيار تصنيف'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
  price: z.coerce.number().min(0, 'السعر لا يمكن أن يكون سالباً'),
})

type CourseForm = z.infer<typeof courseSchema>

export default function NewCoursePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: 'beginner',
      price: 0
    }
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name_ar')
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data: any) => {
    setError(null)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const slug = slugify(data.title) + '-' + Math.random().toString(36).substring(2, 6)

    const { data: newCourse, error: insertError } = await supabase
      .from('courses')
      .insert({
        teacher_id: session.user.id,
        title: data.title,
        title_ar: data.titleAr || data.title,
        slug,
        category_id: data.categoryId,
        level: data.level,
        price: data.price,
        status: 'draft',
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }

    if (newCourse) {
      router.push(`/dashboard/teacher/courses/${newCourse.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">إنشاء دورة جديدة</h1>
          <p className="text-text-secondary text-sm">أدخل المعلومات الأساسية للبدء، يمكنك تعديل وإضافة المزيد لاحقاً.</p>
        </div>
      </div>

      <div className="glass-card p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="عنوان الدورة"
            placeholder="مثال: دورة Next.js الشاملة 2024"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                التصنيف <span className="text-red-500">*</span>
              </label>
              <select
                {...register('categoryId')}
                className="input-field appearance-none w-full bg-surface-2/50 cursor-pointer"
              >
                <option value="">اختر التصنيف</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-surface">{c.name_ar}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1.5 text-sm text-red-500/90">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                المستوى <span className="text-red-500">*</span>
              </label>
              <select
                {...register('level')}
                className="input-field appearance-none w-full bg-surface-2/50 cursor-pointer"
              >
                <option value="beginner" className="bg-surface">مبتدئ</option>
                <option value="intermediate" className="bg-surface">متوسط</option>
                <option value="advanced" className="bg-surface">متقدم</option>
                <option value="all" className="bg-surface">جميع المستويات</option>
              </select>
            </div>
          </div>

          <div className="w-1/2 pr-3">
            <Input
              label="سعر الدورة ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('price')}
              error={errors.price?.message}
              helperText="ضع 0 لجعل الدورة مجانية بالكامل"
            />
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="flex-1 border border-white/10"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              حفظ والمتابعة للإعدادات
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
