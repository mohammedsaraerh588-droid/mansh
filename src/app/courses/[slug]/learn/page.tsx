'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import QuizComponent from '@/components/ui/QuizComponent'
import { cn } from '@/lib/utils'
import { PlayCircle, CheckCircle, FileText, ChevronLeft, ChevronRight, Loader2, Menu, X, ClipboardList } from 'lucide-react'

export default function CourseLearnPage() {
  const { slug }   = useParams()
  const router     = useRouter()
  const supabase   = createSupabaseBrowserClient()

  const [course,       setCourse]       = useState<any>(null)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [progress,     setProgress]     = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [sidebar,      setSidebar]      = useState(true)
  const [showQuiz,     setShowQuiz]     = useState(false)

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
    <div className="h-screen flex items-center justify-center bg-navy">
      <div className="text-center space-y-4">
        <Loader2 size={48} className="spin text-mint mx-auto opacity-50"/>
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Preparing Lecture</p>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-bg fixed inset-0 z-50 overflow-hidden">

      {/* ── Premium Header ── */}
      <header className="h-16 flex items-center justify-between px-6 bg-navy text-white shadow-2xl relative z-20">
        <div className="flex items-center gap-6">
          <Link href={`/courses/${slug}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-mint hover:text-navy transition-all group">
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-sm font-black tracking-tight leading-none mb-1">{course.title}</h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none truncate max-w-[300px]">
              {activeLesson?.title}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">التقدم في الدورة</div>
              <div className="flex items-center gap-3">
                 <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10">
                    <div className="h-full bg-mint shadow-[0_0_10px_#64ffda] transition-all duration-1000" style={{width:`${pct}%`}}/>
                 </div>
                 <span className="text-xs font-black text-mint">{pct}%</span>
              </div>
            </div>
          </div>
          
          <button onClick={() => setSidebar(!sidebar)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-mint/50 transition-all">
            {sidebar ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Sidebar (Course Content) ── */}
        <aside className={cn(
          "bg-white border-l border-border transition-all duration-500 overflow-hidden relative shadow-2xl",
          sidebar ? "w-[350px]" : "w-0"
        )}>
          <div className="flex flex-col h-full w-[350px]">
             <div className="p-6 bg-bg2/50 border-b border-border">
                <h3 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-4 bg-navy rounded-full" />
                   محتوى الدورة
                </h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {course.modules?.map((mod:any, mi:number) => (
                  <div key={mod.id} className="mb-8">
                    <div className="px-3 mb-3">
                       <span className="text-[10px] font-black text-txt3 uppercase tracking-tighter opacity-50 block mb-1">الموديول {mi + 1}</span>
                       <h4 className="text-xs font-black text-navy leading-relaxed">{mod.title}</h4>
                    </div>
                    
                    <div className="space-y-1">
                      {mod.lessons?.map((les:any) => {
                        const active = activeLesson?.id === les.id
                        const done   = isDone(les.id)
                        return (
                          <button 
                            key={les.id} 
                            onClick={() => setActiveLesson(les)}
                            className={cn(
                              "w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group relative",
                              active ? "bg-navy text-white shadow-xl translate-x-1" : "hover:bg-bg2 text-txt1"
                            )}
                          >
                            <div className="mt-1 flex-shrink-0">
                               {done ? (
                                 <div className="w-5 h-5 rounded-full bg-ok flex items-center justify-center"><CheckCircle size={10} className="text-white"/></div>
                               ) : (
                                 <div className={cn(
                                   "w-5 h-5 rounded-lg flex items-center justify-center transition-colors",
                                   active ? "bg-mint text-navy" : "bg-border/40 text-txt3"
                                 )}>
                                   {les.type === 'video' ? <PlayCircle size={10} /> : <FileText size={10} />}
                                 </div>
                               )}
                            </div>
                            <div className="text-right">
                               <span className={cn(
                                 "text-[11px] font-bold leading-snug block",
                                 active ? "text-white" : "text-txt1"
                               )}>{les.title}</span>
                               {les.video_duration > 0 && (
                                 <span className={cn("text-[8px] font-black uppercase tracking-widest", active ? "text-mint" : "text-txt3")}>
                                    {Math.round(les.video_duration/60)} Minutes
                                 </span>
                               )}
                            </div>
                            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-mint rounded-r-full" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* ── Main content (Player/Lecture) ── */}
        <main className="flex-1 overflow-y-auto bg-bg2/30 custom-scrollbar relative">
          {activeLesson ? (
            <div className="max-w-5xl mx-auto py-12 px-6 md:px-10 pb-32">
              
              {/* Media Section */}
              <div className="card border-0 shadow-2xl overflow-hidden bg-navy mb-10 group">
                {activeLesson.type === 'video' ? (
                  <VideoPlayer 
                    publicId={activeLesson.cloudinary_public_id} 
                    url={activeLesson.video_url} 
                    title={activeLesson.title} 
                    onEnded={handleComplete}
                  />
                ) : (
                  <div className="p-10 md:p-16 min-h-[400px] bg-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-full h-1 bg-mint" />
                     {activeLesson.content ? (
                        <div className="prose prose-md max-w-none text-navy font-medium leading-loose" dangerouslySetInnerHTML={{__html: activeLesson.content}} />
                     ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-txt3 opacity-40">
                           <FileText size={48} className="mb-4" />
                           <p className="text-sm font-bold">لا يوجد محتوى نصي لهذا الدرس</p>
                        </div>
                     )}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                   <h2 className="text-2xl md:text-3xl font-black text-navy mb-2 tracking-tight">{activeLesson.title}</h2>
                   <div className="flex items-center gap-4 text-[10px] font-black text-txt3 opacity-60 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><PlayCircle size={12}/> Lecture</span>
                      <span className="flex items-center gap-1.5"><ClipboardList size={12}/> Quiz Available</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setShowQuiz(true)}
                     className="btn border-navy/10 bg-white hover:bg-navy hover:text-white transition-all shadow-lg px-6"
                   >
                      <ClipboardList size={18} className="text-mint" />
                      <span className="text-sm font-black">اختبار الدرس</span>
                   </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white shadow-xl shadow-navy/5 border border-white mt-12">
                 <button 
                   onClick={handleComplete}
                   className={cn(
                     "btn btn-xl min-w-[200px] shadow-lg transition-all transform hover:scale-[1.02]",
                     isDone(activeLesson.id) ? "bg-bg2 text-txt2 opacity-50" : "btn-primary"
                   )}
                 >
                    {isDone(activeLesson.id) ? (
                      <><CheckCircle size={20} className="text-ok"/> تم الإكمال</>
                    ) : (
                      <><CheckCircle size={20}/> إكمال الدرس والانتقال للتالي</>
                    )}
                 </button>
                 
                 <div className="flex items-center gap-2">
                    <button onClick={nextLesson} className="btn btn-ghost text-navy font-black text-sm group">
                       الدرس التالي
                       <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    </button>
                 </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-txt3 opacity-30">
               <div className="text-center">
                  <PlayCircle size={64} className="mx-auto mb-6" />
                  <p className="text-lg font-black uppercase tracking-widest">حدد درساً للبدء</p>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Quiz Overlya Modal ── */}
      {showQuiz && activeLesson && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-navy/60 backdrop-blur-xl animate-in fade-in duration-300"
             onClick={e => { if(e.target===e.currentTarget) setShowQuiz(false) }}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.3)] ring-1 ring-white/10 scale-in-center">
            <div className="p-8 border-b border-border flex items-center justify-between bg-bg2/30">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-mint shadow-xl shadow-navy/20">
                    <ClipboardList size={22} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-navy tracking-tight leading-none mb-1">اختبار الدرس</h3>
                    <p className="text-[10px] font-bold text-txt3 uppercase tracking-widest">{activeLesson.title}</p>
                 </div>
              </div>
              <button onClick={() => setShowQuiz(false)} className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-txt2 hover:bg-err hover:text-white transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <QuizComponent lessonId={activeLesson.id} lessonTitle={activeLesson.title} onClose={() => setShowQuiz(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

