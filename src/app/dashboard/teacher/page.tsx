'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { PlusCircle, Video, Users, DollarSign, Star, TrendingUp, Loader2 } from 'lucide-react'

export default function TeacherDashboard() {
  const [profile,  setProfile]  = useState<any>(null)
  const [stats,    setStats]    = useState({ courses:0, students:0, revenue:0, rating:0 })
  const [recent,   setRecent]   = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(p)
      const { data:courses } = await supabase.from('courses')
        .select('id,title,status,total_students,price,currency,avg_rating,created_at')
        .eq('teacher_id',session.user.id).order('created_at',{ascending:false})
      if (courses) {
        setRecent(courses.slice(0,6))
        let s=0,r=0,rating=0,rc=0
        courses.forEach(c=>{ s+=c.total_students||0; r+=(c.total_students||0)*(c.price||0); if(c.avg_rating>0){rating+=c.avg_rating;rc++} })
        setStats({ courses:courses.length, students:s, revenue:r, rating:rc>0?rating/rc:0 })
      }
      setLoading(false)
    })()
  },[])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  const cards = [
    { label:'الدورات',   value:stats.courses,                        Icon:Video,     bg:'#faf6ec', ic:'var(--gold)'  },
    { label:'الطلاب',    value:stats.students,                       Icon:Users,     bg:'#eff6ff', ic:'#2563eb'      },
    { label:'الإيرادات', value:formatPrice(stats.revenue),           Icon:DollarSign,bg:'#f0fdf4', ic:'#16a34a'      },
    { label:'التقييم',   value:stats.rating>0?stats.rating.toFixed(1)+'★':'جديد', Icon:Star, bg:'#fff7ed', ic:'#ea580c' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:14}}>
        <div>
          <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>لوحة المعلم</p>
          <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>أهلاً {profile?.full_name} 👋</h1>
          <p style={{fontSize:14,color:'var(--txt2)'}}>نظرة عامة على أداء دوراتك.</p>
        </div>
        <Link href="/dashboard/teacher/courses/new" className="btn btn-gold btn-md" style={{textDecoration:'none',display:'inline-flex'}}>
          <PlusCircle size={16}/>دورة جديدة
        </Link>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:14}}>
        {cards.map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="stat-card" style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Icon size={20} style={{color:ic}}/>
            </div>
            <div>
              <div style={{fontSize:13,color:'var(--txt2)',marginBottom:3}}>{label}</div>
              <div style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="card" style={{overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{fontSize:16,fontWeight:900,color:'var(--txt1)',display:'flex',alignItems:'center',gap:8}}><TrendingUp size={17} style={{color:'var(--gold)'}}/>أحدث الدورات</h2>
          <Link href="/dashboard/teacher/courses" style={{fontSize:13,fontWeight:700,color:'var(--gold)',textDecoration:'none'}}>عرض الكل</Link>
        </div>
        {recent.length===0 ? (
          <div style={{padding:40,textAlign:'center'}}>
            <Video size={28} style={{color:'var(--txt3)',margin:'0 auto 12px'}}/>
            <p style={{color:'var(--txt2)',fontSize:14}}>لم تنشئ أي دورات بعد.</p>
            <Link href="/dashboard/teacher/courses/new" className="btn btn-gold btn-sm" style={{textDecoration:'none',display:'inline-flex',marginTop:14}}>ابدأ دورتك الأولى</Link>
          </div>
        ) : (
          <table className="tbl">
            <thead><tr><th>الدورة</th><th style={{textAlign:'center'}}>الحالة</th><th style={{textAlign:'center'}}>الطلاب</th><th style={{textAlign:'left'}}>السعر</th></tr></thead>
            <tbody>
              {recent.map(c=>(
                <tr key={c.id}>
                  <td style={{fontWeight:700}}><Link href={`/dashboard/teacher/courses/${c.id}`} style={{color:'var(--txt1)',textDecoration:'none'}}>{c.title}</Link></td>
                  <td style={{textAlign:'center'}}>
                    <span className={`badge ${c.status==='published'?'badge-green':c.status==='pending'?'badge-gold':'badge-gray'}`}>
                      {c.status==='published'?'منشور':c.status==='pending'?'قيد المراجعة':'مسودة'}
                    </span>
                  </td>
                  <td style={{textAlign:'center',color:'var(--txt2)'}}>{c.total_students||0}</td>
                  <td style={{textAlign:'left',fontWeight:900,color:'var(--gold)'}}>{formatPrice(c.price,c.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
