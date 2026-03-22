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

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('enrollments')
        .select('progress_percentage,enrolled_at,courses(id,title,slug,thumbnail_url,duration_hours,level,total_lessons,price,currency,avg_rating,total_reviews,total_students,category_id,categories(name,name_ar))')
        .eq('student_id',session.user.id).order('enrolled_at',{ascending:false})
      setEnrollments(data||[]); setLoading(false)
    })()
  },[])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>مسيرتي</p>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>دوراتي</h1>
        <p style={{fontSize:14,color:'var(--txt2)'}}>جميع الدورات التي سجّلت فيها.</p>
      </div>

      {enrollments.length===0 ? (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:64,height:64,borderRadius:18,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <BookOpen size={28} style={{color:'var(--txt3)'}}/>
          </div>
          <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لم تسجل في أي دورة بعد</h3>
          <p style={{fontSize:14,color:'var(--txt2)',marginBottom:22}}>ابدأ رحلتك التعليمية الآن وتصفّح مئات الدورات.</p>
          <Link href="/courses" className="btn btn-gold btn-md" style={{textDecoration:'none',display:'inline-flex'}}>استكشف الدورات</Link>
        </div>
      ) : (
        <div className="courses-grid">
          {enrollments.map(e=>(
            <CourseCard key={e.courses?.id} course={{...e.courses, category:e.courses?.categories} as any}/>
          ))}
        </div>
      )}
    </div>
  )
}
