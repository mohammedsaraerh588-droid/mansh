'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { FileText, BookOpen, Loader2 } from 'lucide-react'

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:courses } = await supabase.from('courses').select('id,title').eq('teacher_id',session.user.id)
      if (!courses?.length) { setLoading(false); return }
      const { data:quizData } = await supabase.from('quizzes').select('*').in('course_id',courses.map((c:any)=>c.id))
      setQuizzes((quizData||[]).map((q:any)=>({...q,courseTitle:courses.find((c:any)=>c.id===q.course_id)?.title||'—'})))
      setLoading(false)
    })()
  },[])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--teal)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--teal)',marginBottom:5}}>التقييمات</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--txt1)'}}>الاختبارات</h1>
        <p style={{fontSize:14,color:'var(--txt2)',marginTop:3}}>الاختبارات مرتبطة بالدروس — أضفها من صفحة تعديل محتوى الدرس.</p>
      </div>

      {quizzes.length===0 ? (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'var(--teal-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <FileText size={26} style={{color:'var(--teal)'}}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد اختبارات بعد</h3>
          <p style={{fontSize:14,color:'var(--txt2)',marginBottom:20}}>أضف اختبارات لدروسك من صفحة تعديل الدرس.</p>
          <Link href="/dashboard/teacher/courses" className="btn btn-primary btn-md" style={{textDecoration:'none',display:'inline-flex'}}>
            <BookOpen size={15}/>إدارة الدورات
          </Link>
        </div>
      ) : (
        <div className="card" style={{overflow:'hidden'}}>
          <table className="tbl">
            <thead><tr><th>عنوان الاختبار</th><th>الدورة</th><th style={{textAlign:'center'}}>درجة النجاح</th><th style={{textAlign:'center'}}>المحاولات</th></tr></thead>
            <tbody>
              {quizzes.map(q=>(
                <tr key={q.id}>
                  <td style={{fontWeight:700}}>{q.title}</td>
                  <td style={{color:'var(--txt2)'}}>{q.courseTitle}</td>
                  <td style={{textAlign:'center'}}><span className="badge badge-teal">{q.pass_mark||0}%</span></td>
                  <td style={{textAlign:'center',color:'var(--txt2)'}}>{q.max_attempts||'∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
