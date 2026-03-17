'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { BookOpen, Award, Clock, Flame, Loader2 } from 'lucide-react'

export default function StudentDashboard() {
  const [profile, setProfile]       = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(p)
      const { data: e } = await supabase
        .from('enrollments')
        .select('progress_percentage, enrolled_at, courses(id,title,slug,thumbnail_url,duration_hours,level,total_lessons)')
        .eq('student_id', session.user.id)
        .order('enrolled_at', { ascending: false })
      setEnrollments(e || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
    </div>
  )

  const completed   = enrollments.filter(e => e.progress_percentage === 100).length
  const inProgress  = enrollments.length - completed

  const stats = [
    { label:'الدورات المسجلة', value: enrollments.length, icon: BookOpen, bg:'#eff6ff', color:'#2563eb' },
    { label:'قيد الإنجاز',     value: inProgress,          icon: Flame,    bg:'#fff7ed', color:'#ea580c' },
    { label:'شهادات مكتسبة',  value: completed,            icon: Award,    bg:'#f0fdf4', color:'#059669' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10" style={{background:'var(--gradient-gold)'}} />
        <div className="relative z-10">
          <p className="text-xs font-black tracking-widest uppercase mb-2" style={{color:'var(--gold)', letterSpacing:'0.15em'}}>لوحة الطالب</p>
          <h1 className="text-3xl font-black mb-2" style={{color:'var(--text-primary)'}}>
            مرحباً، {profile?.full_name?.split(' ')[0] || 'طالب'} 👋
          </h1>
          <p style={{color:'var(--text-secondary)'}}>واصل مسيرتك التعليمية وحقق أهدافك اليوم.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s,i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className="w-13 h-13 w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{background:s.bg}}>
              <s.icon className="w-6 h-6" style={{color:s.color}} />
            </div>
            <div>
              <div className="text-3xl font-black" style={{color:'var(--text-primary)'}}>{s.value}</div>
              <div className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black flex items-center gap-2" style={{color:'var(--text-primary)'}}>
            <Clock className="w-5 h-5" style={{color:'var(--gold)'}} />
            واصل التعلم
          </h2>
          <Link href="/courses" className="text-sm font-bold" style={{color:'var(--gold-dark)'}}>استكشف المزيد</Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--surface-3)'}}>
              <BookOpen className="w-8 h-8" style={{color:'var(--text-muted)'}} />
            </div>
            <h3 className="text-xl font-black mb-3" style={{color:'var(--text-primary)'}}>لم تسجل في أي دورة بعد</h3>
            <p className="mb-6" style={{color:'var(--text-secondary)'}}>استكشف مكتبة الدورات وابدأ رحلتك التعليمية</p>
            <Link href="/courses"><button className="btn-gold px-6 py-2.5 rounded-lg text-sm">استكشف الدورات</button></Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.map(e => (
              <CourseCard key={e.courses?.id} course={e.courses as any} showProgress progress={e.progress_percentage || 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
