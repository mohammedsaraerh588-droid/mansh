'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { PlusCircle, Video, Users, DollarSign, Star, Loader2 } from 'lucide-react'

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats,   setStats]   = useState({ courses:0, students:0, revenue:0, rating:0 })
  const [recent,  setRecent]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(p)
      const { data:courses } = await supabase.from('courses')
        .select('id,title,status,total_students,price,currency,avg_rating,created_at')
        .eq('teacher_id', session.user.id).order('created_at', { ascending:false })
      if (courses) {
        setRecent(courses.slice(0,6))
        let s=0, r=0, rating=0, rc=0
        courses.forEach(c => {
          s += c.total_students || 0
          r += (c.total_students||0) * (c.price||0)
          if (c.avg_rating > 0) { rating += c.avg_rating; rc++ }
        })
        setStats({ courses:courses.length, students:s, revenue:r, rating:rc>0 ? Math.round((rating/rc)*10)/10 : 0 })
      }
      setLoading(false)
    })()
  }, [])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--alpha-green)'}}/></div>

  const STATS = [
    { label:'دوراتي',      value:stats.courses,  Icon:Video,       color:'#E8F5E9', ic:'var(--alpha-green)' },
    { label:'إجمالي الطلاب', value:stats.students, Icon:Users,       color:'#E3F2FD', ic:'#1565C0' },
    { label:'الإيرادات',    value:`$${stats.revenue.toLocaleString()}`, Icon:DollarSign, color:'#FFF8E1', ic:'#F57F17' },
    { label:'التقييم',      value:stats.rating || 'جديد', Icon:Star, color:'#FCE4EC', ic:'#C2185B' },
  ]

  const statusLabel = (s:string) => ({ published:'منشور', draft:'مسودة', pending:'مراجعة', archived:'مؤرشف' }[s] || s)
  const statusBadge = (s:string) => ({ published:'badge-green', draft:'badge-gray', pending:'badge-yellow', archived:'badge-dark' }[s] || 'badge-gray')

  return (
    <div style={{display:'flex', flexDirection:'column', gap:24}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
        <div>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>لوحة التحكم</p>
          <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>أهلاً {profile?.full_name?.split(' ')[0] || 'معلم'}</h1>
        </div>
        <Link href="/dashboard/teacher/courses/new" className="btn-register" style={{textDecoration:'none'}}>
          <PlusCircle size={16}/>إضافة دورة جديدة
        </Link>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16}}>
        {STATS.map(({label,value,Icon,color,ic},i) => (
          <div key={i} className="stat-card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:13,color:'var(--tx3)',fontWeight:600}}>{label}</span>
              <div style={{width:36,height:36,borderRadius:9,background:color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon size={16} style={{color:ic}}/>
              </div>
            </div>
            <div style={{fontSize:26,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>{value}</div>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'16px 20px', borderBottom:'1px solid var(--brd)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2 style={{fontSize:16,fontWeight:800,color:'var(--tx1)'}}>دوراتي الأخيرة</h2>
            <Link href="/dashboard/teacher/courses" style={{fontSize:13,color:'var(--alpha-green)',fontWeight:700,textDecoration:'none'}}>عرض الكل</Link>
          </div>
          <table className="tbl">
            <thead><tr><th>الدورة</th><th>الحالة</th><th>الطلاب</th><th>التقييم</th><th></th></tr></thead>
            <tbody>
              {recent.map(c => (
                <tr key={c.id}>
                  <td style={{fontWeight:600,color:'var(--tx1)'}}>{c.title}</td>
                  <td><span className={`badge ${statusBadge(c.status)}`}>{statusLabel(c.status)}</span></td>
                  <td>{c.total_students||0}</td>
                  <td>{c.avg_rating ? `⭐ ${c.avg_rating}` : '—'}</td>
                  <td>
                    <Link href={`/dashboard/teacher/courses/${c.id}`} className="btn btn-outline btn-sm" style={{textDecoration:'none'}}>إدارة</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
