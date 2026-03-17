'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PlusCircle, Users, Video, DollarSign, Star, TrendingUp, Loader2 } from 'lucide-react'

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  })
  const [recentCourses, setRecentCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: pData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(pData)

      // Fetch teacher's courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, status, total_students, price, currency, avg_rating, created_at')
        .eq('teacher_id', session.user.id)
        .order('created_at', { ascending: false })

      if (courses) {
        setRecentCourses(courses.slice(0, 5))
        
        let totalRevenue = 0
        let totalStudents = 0
        let totalRating = 0
        let ratingCount = 0

        courses.forEach(c => {
          totalStudents += c.total_students || 0
          // Approximate revenue (in real app, query payments table)
          totalRevenue += (c.total_students || 0) * (c.price || 0)
          if (c.avg_rating > 0) {
            totalRating += c.avg_rating
            ratingCount++
          }
        })

        setStats({
          totalCourses: courses.length,
          totalStudents,
          totalRevenue,
          avgRating: ratingCount > 0 ? totalRating / ratingCount : 0
        })
      }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm">مُعلم</span>
            لوحة تحكم المُعلم
          </h1>
          <p className="text-text-secondary">مرحباً {profile?.full_name}، إليك نظرة عامة على أداء دوراتك.</p>
        </div>
        <Link href="/dashboard/teacher/courses/new">
          <Button variant="primary" leftIcon={<PlusCircle className="w-5 h-5" />}>
            إنشاء دورة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card flex items-center gap-4 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium mb-1">إجمالي الدورات</div>
            <div className="text-3xl font-black">{stats.totalCourses}</div>
          </div>
        </div>
        
        <div className="stat-card flex items-center gap-4 border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium mb-1">إجمالي الطلاب</div>
            <div className="text-3xl font-black">{stats.totalStudents}</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium mb-1">إجمالي الإيرادات</div>
            <div className="text-3xl font-black">{formatPrice(stats.totalRevenue)}</div>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium mb-1">متوسط التقييم</div>
            <div className="text-3xl font-black">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'جديد'}</div>
          </div>
        </div>
      </div>

      {/* Recent Courses List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            أحدث الدورات
          </h2>
          <Link href="/dashboard/teacher/courses" className="text-sm text-primary hover:underline font-medium">
            عرض الكل
          </Link>
        </div>
        
        {recentCourses.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center">
            <Video className="w-12 h-12 mb-4 opacity-50" />
            <p>لم تقم بإنشاء أي دورات بعد.</p>
            <Link href="/dashboard/teacher/courses/new" className="mt-4">
              <Button variant="secondary" size="sm">ابدأ بإنشاء دورتك الأولى</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-right">عنوان الدورة</th>
                  <th className="text-center">الحالة</th>
                  <th className="text-center">الطلاب</th>
                  <th className="text-left">السعر</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="font-medium max-w-[300px] truncate">
                      <Link href={`/dashboard/teacher/courses/${course.id}`} className="hover:text-primary transition-colors">
                        {course.title}
                      </Link>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        course.status === 'published' ? 'badge-success' :
                        course.status === 'pending' ? 'badge-warning' : 'badge-gray'
                      }`}>
                        {course.status === 'published' ? 'منشور' :
                         course.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
                      </span>
                    </td>
                    <td className="text-center text-text-secondary">{course.total_students || 0}</td>
                    <td className="text-left font-semibold text-primary-light">
                      {formatPrice(course.price, course.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
