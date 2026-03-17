'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PlusCircle, Search, Video, Filter, ArrowRight, Loader2 } from 'lucide-react'
import { Users, Star } from 'lucide-react'

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('courses')
        .select(`
          id, title, status, total_students, price, currency, avg_rating, created_at,
          category:categories(name_ar)
        `)
        .eq('teacher_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setCourses(data)
      setLoading(false)
    }
    
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/teacher">
            <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              إدارة الدورات
            </h1>
            <p className="text-text-secondary">إدارة وتعديل كافة الدورات الخاصة بك.</p>
          </div>
        </div>
        <Link href="/dashboard/teacher/courses/new">
          <Button variant="primary" leftIcon={<PlusCircle className="w-5 h-5" />}>
            إنشاء دورة جديدة
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-text-muted absolute right-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="ابحث عن دورة..." 
            className="w-full pl-4 pr-12 py-3 bg-white border border-border rounded-xl outline-none focus:border-primary transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="bg-white border-border shadow-sm text-text-secondary" leftIcon={<Filter className="w-4 h-4" />}>
          تصفية
        </Button>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
          <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6 text-text-muted">
            <Video className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد دورات مطابقة</h3>
          <p className="text-text-secondary mb-8">ابدأ بإنشاء دورة جديدة لجذب الطلاب.</p>
          <Link href="/dashboard/teacher/courses/new">
            <Button variant="secondary">إنشاء دورتك الأولى</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="glass-card flex flex-col group hover:border-primary/50 transition-all duration-300">
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`badge ${
                    course.status === 'published' ? 'badge-success' :
                    course.status === 'pending' ? 'badge-warning' : 'badge-gray'
                  }`}>
                    {course.status === 'published' ? 'منشور' :
                     course.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    {course.category?.name_ar || 'بدون تصنيف'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <div className="flex items-center gap-6 text-sm text-text-secondary mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{course.total_students || 0} طالباً</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span>{course.avg_rating > 0 ? course.avg_rating.toFixed(1) : 'جديد'}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-surface-2 border-t border-border flex items-center justify-between rounded-b-3xl">
                <div className="font-black text-lg text-secondary">
                  {formatPrice(course.price, course.currency)}
                </div>
                <Link href={`/dashboard/teacher/courses/${course.id}`}>
                  <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-white border-transparent hover:border-primary/20">
                    تعديل الدورة
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
