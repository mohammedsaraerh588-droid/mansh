'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { BookOpen, Loader2 } from 'lucide-react'

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('enrollments')
        .select(`
          progress_percentage,
          enrolled_at,
          courses (
            id, title, slug, thumbnail_url, duration_hours, level, total_lessons, category_id,
            categories (
               name, name_ar
            )
          )
        `)
        .eq('student_id', session.user.id)
        .order('enrolled_at', { ascending: false })
      
      setEnrollments(data || [])
      setLoading(false)
    }
    
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">دوراتي</h1>
        <p className="text-text-secondary">جميع الدورات التي قمت بالتسجيل بها</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6 text-text-muted border border-border">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-3">لم تسجل في أي دورة بعد</h3>
          <p className="text-text-secondary mb-6">استكشف مكتبة الدورات لدينا وابدأ رحلتك التعليمية</p>
          <Link href="/courses">
            <button className="btn-primary">استكشف الدورات</button>
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {enrollments.map((enr) => {
            // Reformat the mapped joined categories to match CourseCard expectations
            const courseData = {
              ...enr.courses,
              category: enr.courses.categories
            };

            return (
               <CourseCard 
                key={enr.courses.id} 
                course={courseData as any} 
                showProgress 
                progress={enr.progress_percentage || 0}
              />
            );
          })}
        </div>
      )}
    </div>
  )
}
