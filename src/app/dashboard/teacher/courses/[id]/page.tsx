'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ArrowRight, BookOpen, Settings, Users, Loader2 } from 'lucide-react'

export default function ManageCoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCourse = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from('courses')
        .select(`*, categories(name, name_ar)`)
        .eq('id', id)
        .eq('teacher_id', session.user.id)
        .single()

      if (error || !data) {
        router.push('/dashboard/teacher')
        return
      }
      setCourse(data)
      setLoading(false)
    }
    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/teacher">
          <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            إدارة الدورة: {course.title}
            <span className={`badge text-xs ${
              course.status === 'published' ? 'badge-success' :
              course.status === 'pending' ? 'badge-warning' : 'badge-gray'
            }`}>
              {course.status === 'published' ? 'منشور' :
               course.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
            </span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">تحديث محتوى وتفاصيل الدورة الخاصة بك</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <div className="md:col-span-2 glass-card p-6 bg-white border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border pb-4 text-secondary">
            <Settings className="w-5 h-5 text-primary" />
            خيارات الإدارة
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href={`/dashboard/teacher/courses/${id}/curriculum`} className="block group">
              <div className="p-6 rounded-xl border-2 border-border hover:border-primary bg-surface-2 hover:bg-primary-light transition-all h-full text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-dark">المنهج والدروس</h3>
                  <p className="text-sm text-text-secondary">إضافة الفصول ومقاطع الفيديو</p>
                </div>
              </div>
            </Link>

            <Link href={`/dashboard/teacher/courses/${id}/edit`} className="block group">
              <div className="p-6 rounded-xl border-2 border-border hover:border-primary bg-surface-2 hover:bg-primary-light transition-all h-full text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Settings className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-dark">تفاصيل الدورة</h3>
                  <p className="text-sm text-text-secondary">تعديل العنوان، الوصف، والسعر</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="glass-card p-6 bg-white border border-border h-fit">
          <h3 className="font-bold text-lg mb-4 text-secondary border-b border-border pb-2">نظرة سريعة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">التصنيف</span>
              <span className="font-semibold">{course.categories?.name_ar || '-'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">الطلاب المسجلين</span>
              <span className="font-semibold flex items-center justify-center gap-1 bg-primary-light text-primary-dark px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3" />
                {course.total_students || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">السعر</span>
              <span className="font-bold text-success">{course.price} {course.currency}</span>
            </div>

            {course.status === 'draft' && (
              <div className="pt-4 border-t border-border mt-4">
                <Button className="w-full" variant="primary">
                  طلب مراجعة ونشر
                </Button>
                <p className="text-xs text-text-muted mt-2 text-center">
                  يجب إضافة محتوى (دروس) قبل النشر.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
