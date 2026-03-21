'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import VideoPlayer from '@/components/ui/VideoPlayer'
import QuizComponent from '@/components/ui/QuizComponent'
import { PlayCircle, CheckCircle, FileText, ChevronLeft, ChevronRight, Loader2, Menu, X, ClipboardList, Award } from 'lucide-react'

export default function CourseLearnPage() {
  const { slug }   = useParams()
  const router     = useRouter()
  const supabase   = createSupabaseBrowserClient()

  const [course,       setCourse]       = useState<any>(null)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [progress,     setProgress]     = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [sidebar,      setSidebar]      = useState(true)
  const [certReady, setCertReady] = useState(false)
  const [showQuiz,  setShowQuiz]  = useState(false)

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      const { data: c } = await supabase.from('courses')
        .select('id,title,modules(id,title,position,lessons(id,title,type,content,video_url,cloudinary_public_id,is_preview,position))')
        .eq('slug', slug).single()
      if (!c) { router.push('/dashboard/student'); return }
      const { data: enr } = await supabase.from('enrollments').select('payment_status')
        .eq('student_id', session.user.id).eq('course_id', c.id).single()
      if (!enr || !['completed','free'].includes(enr.payment_status)) {
        router.push(`/courses/${slug}`); return
      }
      c.modules?.sort((a:any,b:any)=>a.position-b.position)
      c.modules?.forEach((m:any)=>m.lessons?.sort((a:any,b:any)=>a.position-b.position))
      const { data: prog } = await supabase.from('lesson_progress')
        .select('lesson_id,is_completed').eq('student_id',session.user.id).eq('course_id',c.id)
      setCourse(c); setProgress(prog||[])
      if (c.modules?.[0]?.lessons?.[0]) setActiveLesson(c.modules[0].lessons[0])
      setLoading(false)
    })()
  }, [slug])

  const isDone = (id:string) => progress.some(p=>p.lesson_id===id&&p.is_completed)
  const totalLessons = course?.modules?.reduce((s:number,m:any)=>s+(m.lessons?.length||0),0)||0
  const completedCount = progress.filter(p=>p.is_completed).length
  const pct = totalLessons>0 ? Math.round((completedCount/totalLessons)*100) : 0

  const markDone = async (lessonId:string) => {
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session||!course) return
    if (!isDone(lessonId)) setProgress(p=>[...p,{lesson_id:lessonId,is_completed:true}])
    await supabase.from('lesson_progress').upsert(
      { student_id:session.user.id, course_id:course.id, lesson_id:lessonId, is_completed:true, completed_at:new Date().toISOString() },
      { onConflict:'student_id,lesson_id' }
    )
    const newDone = progress.filter(p=>p.is_completed).length + (isDone(lessonId)?0:1)
    const p2 = totalLessons>0 ? Math.round((newDone/totalLessons)*100) : 0
    await supabase.from('enrollments').update({ progress_percentage:p2 })
      .eq('student_id',session.user.id).eq('course_id',course.id)
    // 🏆 عند إكمال 100% — توليد الشهادة تلقائياً
    if (p2 >= 100) {
      setCertReady(true)
      fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      }).catch(() => {})
    }
  }

  const nextLesson = () => {
    if (!course||!activeLesson) return
    let mi=-1,li=-1
    course.modules.forEach((m:any,i:number)=>{
      const idx=m.lessons.findIndex((l:any)=>l.id===activeLesson.id)
      if(idx!==-1){mi=i;li=idx}
    })
    if(mi===-1) return
    if(li+1<course.modules[mi].lessons.length) setActiveLesson(course.modules[mi].lessons[li+1])
    else if(mi+1<course.modules.length&&course.modules[mi+1].lessons.length>0) setActiveLesson(course.modules[mi+1].lessons[0])
  }

  const handleComplete = () => { markDone(activeLesson.id); nextLesson() }

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{textAlign:'center'}}>
        <Loader2 size={36} className="spin" style={{color:'var(--teal)',margin:'0 auto 12px'}}/>
        <p style={{color:'var(--txt2)',fontSize:14}}>جاري تحميل الدورة...</p>
      </div>
    </div>
  )

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg)',position:'fixed',inset:0,zIndex:50}}>

      {/* Header */}
      <header style={{height:56,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',background:'var(--surface)',borderBottom:'1px solid var(--border)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Link href={`/courses/${slug}`} style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',textDecoration:'none',color:'var(--txt2)'}}>
            <ChevronRight size={16}/>
          </Link>
          <span style={{fontWeight:700,fontSize:14,color:'var(--txt1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:260}}>{course.title}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:7,fontSize:12,color:'var(--txt2)'}}>
            <div style={{width:90,height:5,borderRadius:99,background:'var(--bg3)',overflow:'hidden'}}>
              <div style={{height:'100%',background:'var(--teal)',borderRadius:99,width:`${pct}%`,transition:'width .5s'}}/>
            </div>
            <span style={{fontWeight:700,color:'var(--teal)'}}>{pct}%</span>
          </div>
          <button onClick={()=>setSidebar(!sidebar)} style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',cursor:'pointer'}}>
            {sidebar?<X size={15} style={{color:'var(--txt2)'}}/>:<Menu size={15} style={{color:'var(--txt2)'}}/>}
          </button>
        </div>
      </header>

      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        {/* Main */}
        <div style={{flex:1,overflowY:'auto'}}>
          {activeLesson ? (
            <div style={{maxWidth:900,width:'100%',margin:'0 auto',padding:'24px 20px 80px'}}>
              <h2 style={{fontSize:20,fontWeight:900,marginBottom:16,color:'var(--txt1)'}}>{activeLesson.title}</h2>

              {activeLesson.type==='video' ? (
                <VideoPlayer publicId={activeLesson.cloudinary_public_id} url={activeLesson.video_url} title={activeLesson.title} onEnded={handleComplete}/>
              ) : (
                <div style={{padding:24,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,minHeight:280,lineHeight:1.8,color:'var(--txt1)',fontSize:15}}>
                  {activeLesson.content
                    ? <div dangerouslySetInnerHTML={{__html:activeLesson.content}}/>
                    : <p style={{color:'var(--txt3)',textAlign:'center',paddingTop:40}}>لا يوجد محتوى نصي.</p>}
                </div>
              )}

              {/* Action bar */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:18,padding:'14px 18px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,gap:10,flexWrap:'wrap'}}>
                <div style={{display:'flex',gap:9}}>
                  <button onClick={handleComplete} className={`btn btn-lg ${isDone(activeLesson.id)?'btn-outline':'btn-primary'}`}>
                    <CheckCircle size={15}/>{isDone(activeLesson.id)?'مكتمل ✓':'اكتمال والتالي'}
                  </button>
                  {/* زر الاختبار */}
                  <button onClick={()=>setShowQuiz(true)} className="btn btn-outline btn-lg" style={{borderColor:'var(--teal)',color:'var(--teal)'}}>
                    <ClipboardList size={15}/>اختبار الدرس
                  </button>
                </div>
                <button onClick={nextLesson} className="btn btn-ghost btn-md">
                  الدرس التالي<ChevronLeft size={13}/>
                </button>
              </div>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--txt3)',fontSize:14}}>
              اختر درساً من القائمة للبدء
            </div>
          )}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <div style={{width:290,borderRight:'1px solid var(--border)',background:'var(--surface)',display:'flex',flexDirection:'column',flexShrink:0}}>
            <div style={{padding:'12px 14px',borderBottom:'1px solid var(--border)',fontWeight:800,fontSize:13,color:'var(--txt2)',position:'sticky',top:0,background:'var(--surface)',zIndex:1}}>محتوى الدورة</div>
            <div style={{flex:1,overflowY:'auto',padding:'8px'}}>
              {course.modules?.map((mod:any,mi:number)=>(
                <div key={mod.id} style={{marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:800,color:'var(--txt3)',padding:'4px 8px',marginBottom:3,letterSpacing:'.05em',textTransform:'uppercase'}}>
                    {mi+1}. {mod.title}
                  </div>
                  {mod.lessons?.map((les:any)=>{
                    const active = activeLesson?.id===les.id
                    const done   = isDone(les.id)
                    return (
                      <button key={les.id} onClick={()=>setActiveLesson(les)}
                        style={{width:'100%',textAlign:'right',padding:'8px 10px',borderRadius:8,border:'none',cursor:'pointer',display:'flex',alignItems:'flex-start',gap:8,marginBottom:2,background:active?'var(--teal-soft)':'transparent',transition:'background .12s'}}
                        onMouseEnter={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background='var(--bg2)' }}
                        onMouseLeave={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background='transparent' }}>
                        <div style={{marginTop:2,flexShrink:0}}>
                          {done?<CheckCircle size={13} style={{color:'var(--ok)'}}/>:les.type==='video'?<PlayCircle size={13} style={{color:active?'var(--teal)':'var(--txt3)'}}/>:<FileText size={13} style={{color:active?'var(--teal)':'var(--txt3)'}}/>}
                        </div>
                        <span style={{fontSize:12.5,fontWeight:active?700:500,color:active?'var(--teal)':'var(--txt2)',lineHeight:1.4}}>{les.title}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🏆 Certificate Popup — يظهر تلقائياً عند 100% */}
      {certReady && (
        <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.65)',backdropFilter:'blur(6px)'}}>
          <div style={{background:'var(--surface)',borderRadius:20,padding:'40px 48px',textAlign:'center',maxWidth:460,width:'90%',boxShadow:'var(--sh4)',border:'1px solid var(--brd)'}}>
            <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,#635BFF,#0EA5E9)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 32px rgba(99,91,255,.4)'}}>
              <Award size={32} style={{color:'#fff'}}/>
            </div>
            <h2 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:8,letterSpacing:'-.02em'}}>🎉 مبروك! أتممت الدورة</h2>
            <p style={{fontSize:15,color:'var(--tx3)',marginBottom:24,lineHeight:1.7}}>
              لقد أتممت الدورة بنجاح! تم إصدار شهادتك تلقائياً ويمكنك تحميلها الآن.
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <Link href="/dashboard/student/certificates" className="btn btn-primary btn-lg" style={{textDecoration:'none'}}>
                <Award size={16}/>عرض الشهادة
              </Link>
              <button onClick={()=>setCertReady(false)} className="btn btn-outline btn-lg">
                متابعة التعلم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && activeLesson && (
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20,background:'rgba(0,0,0,.55)',backdropFilter:'blur(4px)'}}
          onClick={e=>{ if(e.target===e.currentTarget) setShowQuiz(false) }}>
          <div style={{background:'var(--surface)',borderRadius:18,width:'100%',maxWidth:620,maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'var(--s3)'}}>
            {/* Modal header */}
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'center',gap:9}}>
                <div style={{width:34,height:34,borderRadius:9,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <ClipboardList size={16} style={{color:'var(--teal)'}}/>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:'var(--txt1)'}}>اختبار الدرس</div>
                  <div style={{fontSize:12,color:'var(--txt3)'}}>{activeLesson.title}</div>
                </div>
              </div>
              <button onClick={()=>setShowQuiz(false)} style={{width:30,height:30,borderRadius:8,border:'1px solid var(--border)',background:'var(--bg2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <X size={14} style={{color:'var(--txt2)'}}/>
              </button>
            </div>
            {/* Quiz content */}
            <div style={{overflow:'auto',padding:'20px',flex:1}}>
              <QuizComponent lessonId={activeLesson.id} lessonTitle={activeLesson.title} onClose={()=>setShowQuiz(false)}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
