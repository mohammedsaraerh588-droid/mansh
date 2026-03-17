'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { BookOpen, Award, Clock, Flame, Loader2 } from 'lucide-react'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch profile
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(pData)

      // Fetch enrollments with course details
      const { data: eData } = await supabase
        .from('enrollments')
        .select(`
          progress_percentage,
          enrolled_at,
          courses (
            id, title, slug, thumbnail_url, duration_hours, level, total_lessons
          )
        `)
        .eq('student_id', session.user.id)
        .order('enrolled_at', { ascending: false })
      
      setEnrollments(eData || [])
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const completedCourses = enrollments.filter(e => e.progress_percentage === 100).length
  const inProgressCourses = enrollments.length - completedCourses

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl font-bold mb-2">مرحباً بعودتك، {profile?.full_name?.split(' ')[0] || 'طالب'}! 👋</h1>
        <p className="text-text-secondary">واصل مسيرتك التعليمية وحقق أهدافك اليوم.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black">{enrollments.length}</div>
            <div className="text-sm text-text-secondary font-medium">الدورات المسجلة</div>
          </div>
        </div>
        
        <div className="stat-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black">{inProgressCourses}</div>
            <div className="text-sm text-text-secondary font-medium">قيد الإنجاز</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-black">{completedCourses}</div>
            <div className="text-sm text-text-secondary font-medium">الشهادات المكتسبة</div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            واصل التعلم
          </h2>
        </div>

        {enrollments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-text-muted">
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
            {enrollments.map((enr) => (
              <CourseCard 
                key={enr.courses.id} 
                course={enr.courses as any} 
                showProgress 
                progress={enr.progress_percentage || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
