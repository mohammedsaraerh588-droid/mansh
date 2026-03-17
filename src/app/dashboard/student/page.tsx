'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { BookOpen, Award, Flame, Clock, Loader2 } from 'lucide-react'

export default function StudentDashboard() {
  const [profile,     setProfile]     = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(p)
      const { data:e } = await supabase.from('enrollments')
        .select('progress_percentage,enrolled_at,courses(id,title,slug,thumbnail_url,duration_hours,level,total_lessons,price,currency,avg_rating,total_reviews,total_students,category_id)')
        .eq('student_id',session.user.id).order('enrolled_at',{ascending:false})
      setEnrollments(e||[])
      setLoading(false)
    })()
  },[])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/>
    </div>
  )

  const done = enrollments.filter(e=>e.progress_percentage===100).length
  const inP  = enrollments.length - done
  const stats = [
    { label:'مسجّل فيها',  value:enrollments.length, Icon:BookOpen, bg:'#eff6ff', ic:'#2563eb' },
    { label:'قيد الإنجاز',  value:inP,                Icon:Flame,   bg:'#fff7ed', ic:'#ea580c' },
    { label:'شهادات',       value:done,               Icon:Award,   bg:'#f0fdf4', ic:'#16a34a' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {/* Welcome */}
      <div className="card" style={{padding:'28px 28px 28px 28px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,right:0,width:160,height:160,borderRadius:'0 14px 0 80px',background:'linear-gradient(135deg,#b8912a,#f0c96a)',opacity:.08}}/>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:6}}>لوحة الطالب</p>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>أهلاً، {profile?.full_name?.split(' ')[0]||'طالب'} 👋</h1>
        <p style={{fontSize:14,color:'var(--txt2)'}}>واصل مسيرتك التعليمية وحقق أهدافك اليوم.</p>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14}}>
        {stats.map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="stat-card" style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',background:bg,flexShrink:0}}>
              <Icon size={20} style={{color:ic}}/>
            </div>
            <div>
              <div style={{fontSize:26,fontWeight:900,color:'var(--txt1)'}}>{value}</div>
              <div style={{fontSize:12,color:'var(--txt2)'}}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:900,color:'var(--txt1)',display:'flex',alignItems:'center',gap:8}}>
            <Clock size={18} style={{color:'var(--gold)'}}/>واصل التعلم
          </h2>
          <Link href="/courses" style={{fontSize:13,fontWeight:700,color:'var(--gold)',textDecoration:'none'}}>استكشف المزيد</Link>
        </div>

        {enrollments.length===0 ? (
          <div className="card" style={{padding:48,textAlign:'center'}}>
            <div style={{width:56,height:56,borderRadius:16,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><BookOpen size={24} style={{color:'var(--txt3)'}}/></div>
            <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لم تسجل في أي دورة بعد</h3>
            <p style={{fontSize:13.5,color:'var(--txt2)',marginBottom:20}}>ابدأ رحلتك التعليمية الآن</p>
            <Link href="/courses" className="btn btn-gold btn-md" style={{textDecoration:'none'}}>استكشف الدورات</Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.map(e=><CourseCard key={e.courses?.id} course={e.courses as any} showProgress progress={e.progress_percentage||0}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
