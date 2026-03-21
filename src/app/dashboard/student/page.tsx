'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { BookOpen, Award, Flame, Clock, PlayCircle, Loader2, TrendingUp } from 'lucide-react'

export default function StudentDashboard() {
  const [profile,     setProfile]     = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(p)
      const { data:e } = await supabase.from('enrollments')
        .select('progress_percentage,enrolled_at,courses(id,title,slug,thumbnail_url,level,total_lessons,price,currency)')
        .eq('student_id', session.user.id)
        .order('enrolled_at', {ascending:false})
      setEnrollments(e||[])
      setLoading(false)
    })()
  },[])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--alpha-green)'}}/>
    </div>
  )

  const done = enrollments.filter(e=>e.progress_percentage===100).length
  const inP  = enrollments.filter(e=>e.progress_percentage>0&&e.progress_percentage<100).length
  const totalPct = enrollments.length>0
    ? Math.round(enrollments.reduce((s,e)=>s+(e.progress_percentage||0),0)/enrollments.length)
    : 0

  const STATS = [
    { label:'مسجّل فيها',   value:enrollments.length, Icon:BookOpen, color:'#E8F5E9', ic:'var(--alpha-green)' },
    { label:'قيد الإنجاز',   value:inP,                Icon:Flame,   color:'#FFF3E0', ic:'#F57F17' },
    { label:'مكتملة',        value:done,               Icon:Award,   color:'#F3E5F5', ic:'#7B1FA2' },
    { label:'متوسط التقدم',  value:`${totalPct}%`,     Icon:TrendingUp, color:'#E3F2FD', ic:'#1565C0' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {/* Welcome */}
      <div style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)',borderRadius:16,padding:'28px 28px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,left:-20,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,.05)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <p style={{fontSize:12,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginBottom:4}}>لوحة الطالب</p>
          <h1 style={{fontSize:24,fontWeight:900,color:'#fff',letterSpacing:'-.02em',marginBottom:6}}>
            أهلاً {profile?.full_name?.split(' ')[0] || 'طالب'} 👋
          </h1>
          <p style={{fontSize:14,color:'rgba(255,255,255,.65)'}}>
            {enrollments.length===0
              ? 'ابدأ رحلتك الطبية اليوم بالتسجيل في أول دورة!'
              : `لديك ${enrollments.length} دورة — واصل التعلم!`}
          </p>
          {enrollments.length===0 && (
            <Link href="/courses" className="btn-register" style={{textDecoration:'none',display:'inline-flex',marginTop:14,fontSize:13,padding:'8px 20px'}}>
              <BookOpen size={14}/>تصفّح الدورات
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:14}}>
        {STATS.map(({label,value,Icon,color,ic},i) => (
          <div key={i} className="stat-card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:12,color:'var(--tx3)',fontWeight:600}}>{label}</span>
              <div style={{width:34,height:34,borderRadius:9,background:color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon size={15} style={{color:ic}}/>
              </div>
            </div>
            <div style={{fontSize:26,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>{value}</div>
          </div>
        ))}
      </div>

      {/* Courses in progress */}
      {enrollments.length > 0 && (
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h2 style={{fontSize:16,fontWeight:800,color:'var(--tx1)'}}>دوراتي</h2>
            <Link href="/dashboard/student/courses" style={{fontSize:13,color:'var(--alpha-green)',fontWeight:700,textDecoration:'none'}}>عرض الكل</Link>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {enrollments.slice(0,5).map((e:any,i:number) => {
              const c = e.courses; if(!c) return null
              const pct = e.progress_percentage || 0
              return (
                <div key={i} className="card" style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:48,height:48,borderRadius:10,overflow:'hidden',flexShrink:0,background:'linear-gradient(135deg,#1B5E20,#388E3C)'}}>
                    {c.thumbnail_url?<img src={c.thumbnail_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📚</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:'var(--tx1)',marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div>
                    <div style={{height:5,borderRadius:99,background:'var(--surface3)',overflow:'hidden',marginBottom:4}}>
                      <div style={{height:'100%',borderRadius:99,background:pct===100?'var(--ok)':'var(--alpha-green)',width:`${pct}%`,transition:'width .4s'}}/>
                    </div>
                    <div style={{fontSize:11,color:'var(--tx3)',display:'flex',justifyContent:'space-between'}}>
                      <span>{pct===100?'✅ مكتملة':pct===0?'لم تبدأ بعد':`${pct}% مكتمل`}</span>
                      <span>{c.total_lessons} درس</span>
                    </div>
                  </div>
                  <Link href={`/courses/${c.slug}/learn`} className="btn-register btn-sm" style={{textDecoration:'none',flexShrink:0,padding:'7px 14px',fontSize:12}}>
                    <PlayCircle size={13}/>{pct===0?'ابدأ':'واصل'}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
