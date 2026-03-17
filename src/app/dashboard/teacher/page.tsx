'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { PlusCircle, Users, Video, DollarSign, Star, TrendingUp, Loader2 } from 'lucide-react'

export default function TeacherDashboard() {
  const [profile, setProfile]         = useState<any>(null)
  const [stats, setStats]             = useState({ courses:0, students:0, revenue:0, rating:0 })
  const [recentCourses, setRecent]    = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(p)
      const { data: courses } = await supabase
        .from('courses').select('id,title,status,total_students,price,currency,avg_rating,created_at')
        .eq('teacher_id', session.user.id).order('created_at', { ascending: false })
      if (courses) {
        setRecent(courses.slice(0,5))
        let students=0, revenue=0, rating=0, rc=0
        courses.forEach(c => {
          students += c.total_students||0
          revenue  += (c.total_students||0)*(c.price||0)
          if (c.avg_rating>0) { rating+=c.avg_rating; rc++ }
        })
        setStats({ courses:courses.length, students, revenue, rating: rc>0 ? rating/rc : 0 })
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
    </div>
  )

  const cards = [
    { label:'الدورات',    value: stats.courses,                  icon: Video,     bg:'#faf6ec', color:'var(--gold-dark)' },
    { label:'الطلاب',     value: stats.students,                 icon: Users,     bg:'#eff6ff', color:'#2563eb' },
    { label:'الإيرادات',  value: formatPrice(stats.revenue),     icon: DollarSign,bg:'#f0fdf4', color:'#059669' },
    { label:'التقييم',    value: stats.rating>0?stats.rating.toFixed(1)+'★':'جديد', icon:Star, bg:'#fff7ed', color:'#ea580c' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{color:'var(--gold)',letterSpacing:'0.15em'}}>لوحة المعلم</p>
          <h1 className="text-3xl font-black" style={{color:'var(--text-primary)'}}>مرحباً {profile?.full_name} 👋</h1>
          <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>نظرة عامة على أداء دوراتك</p>
        </div>
        <Link href="/dashboard/teacher/courses/new">
          <button className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm">
            <PlusCircle className="w-4 h-4" /> دورة جديدة
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s,i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background:s.bg}}>
              <s.icon className="w-5 h-5" style={{color:s.color}} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{color:'var(--text-secondary)'}}>{s.label}</div>
              <div className="text-2xl font-black" style={{color:'var(--text-primary)'}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{borderColor:'var(--border)'}}>
          <h2 className="text-lg font-black flex items-center gap-2" style={{color:'var(--text-primary)'}}>
            <TrendingUp className="w-5 h-5" style={{color:'var(--gold)'}} /> أحدث الدورات
          </h2>
          <Link href="/dashboard/teacher/courses" className="text-sm font-bold" style={{color:'var(--gold-dark)'}}>عرض الكل</Link>
        </div>
        {recentCourses.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-10 h-10 mx-auto mb-3" style={{color:'var(--text-muted)'}} />
            <p style={{color:'var(--text-secondary)'}}>لم تقم بإنشاء أي دورات بعد.</p>
            <Link href="/dashboard/teacher/courses/new" className="inline-block mt-4">
              <button className="btn-gold px-5 py-2 rounded-lg text-sm">ابدأ دورتك الأولى</button>
            </Link>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr>
              <th>عنوان الدورة</th><th className="text-center">الحالة</th>
              <th className="text-center">الطلاب</th><th className="text-left">السعر</th>
            </tr></thead>
            <tbody>
              {recentCourses.map(c => (
                <tr key={c.id}>
                  <td className="font-bold" style={{color:'var(--text-primary)'}}>
                    <Link href={`/dashboard/teacher/courses/${c.id}`} className="hover:underline" style={{color:'var(--text-primary)'}}>{c.title}</Link>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${c.status==='published'?'badge-success':c.status==='pending'?'badge-warning':'badge-gray'}`}>
                      {c.status==='published'?'منشور':c.status==='pending'?'قيد المراجعة':'مسودة'}
                    </span>
                  </td>
                  <td className="text-center" style={{color:'var(--text-secondary)'}}>{c.total_students||0}</td>
                  <td className="text-left font-black" style={{color:'var(--gold-dark)'}}>{formatPrice(c.price,c.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
