'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { PlayCircle, CheckCircle, FileText, Menu, ChevronRight, Loader2 } from 'lucide-react'

export default function CourseLearnPage() {
  const { slug } = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  
  const [course, setCourse] = useState<any>(null)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Fetch course and curriculum
      const { data: courseData } = await supabase
        .from('courses')
        .select(`
          id, title,
          modules(
            id, title, position,
            lessons(id, title, type, content, video_url, cloudinary_public_id, position)
          )
        `)
        .eq('slug', slug)
        .single()

      if (!courseData) {
        router.push('/dashboard/student')
        return
      }

      // Check enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, payment_status')
        .eq('student_id', session.user.id)
        .eq('course_id', courseData.id)
        .single()

      if (!enrollment || (enrollment.payment_status !== 'completed' && enrollment.payment_status !== 'free')) {
        // Not enrolled or not paid, redirect back to course details
        router.push(`/courses/${slug}`)
        return
      }

      // Fetch progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed')
        .eq('student_id', session.user.id)
        .eq('course_id', courseData.id)

      // Sort
      courseData.modules?.sort((a: any, b: any) => a.position - b.position)
      courseData.modules?.forEach((m: any) => m.lessons?.sort((a: any, b: any) => a.position - b.position))

      setCourse(courseData)
      setProgress(progressData || [])

      // Set first lesson as active if none selected
      if (courseData.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(courseData.modules[0].lessons[0])
      }

      setLoading(false)
    }

    fetchCourseAndProgress()
  }, [slug])

  const markLessonCompleted = async (lessonId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || !course) return

    // Optismistic update
    if (!progress.find(p => p.lesson_id === lessonId)?.is_completed) {
      setProgress([...progress, { lesson_id: lessonId, is_completed: true }])
    }

    await supabase.from('lesson_progress').upsert({
      student_id: session.user.id,
      course_id: course.id,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString()
    }, { onConflict: 'student_id,lesson_id' })
  }

  const navigateToNextLesson = () => {
    if (!course || !activeLesson) return
    
    // Find current indices
    let mIdx = -1, lIdx = -1
    course.modules.forEach((m: any, i: number) => {
      const idx = m.lessons.findIndex((l: any) => l.id === activeLesson.id)
      if (idx !== -1) {
        mIdx = i
        lIdx = idx
      }
    })

    if (mIdx === -1) return

    // Next in same module
    if (lIdx + 1 < course.modules[mIdx].lessons.length) {
      setActiveLesson(course.modules[mIdx].lessons[lIdx + 1])
    } 
    // Next module
    else if (mIdx + 1 < course.modules.length && course.modules[mIdx + 1].lessons.length > 0) {
      setActiveLesson(course.modules[mIdx + 1].lessons[0])
    }
  }

  const handleLessonComplete = () => {
    markLessonCompleted(activeLesson.id)
    navigateToNextLesson()
  }

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold">جاري تحميل الدورة...</h2>
        </div>
      </div>
    )
  }

  const isCompleted = (lessonId: string) => progress.some(p => p.lesson_id === lessonId && p.is_completed)

  return (
    <div className="h-screen flex flex-col bg-surface fixed inset-0 z-50">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-surface-2 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${slug}`} className="p-2 hover:bg-white/10 rounded-lg text-text-muted transition-colors">
            <ChevronRight className="w-6 h-6" />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="font-bold truncate max-w-sm">{course.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface relative">
          {activeLesson ? (
            <div className="max-w-5xl mx-auto w-full p-4 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">{activeLesson.title}</h2>
              
              {/* Media Player / Content Area */}
              <div className="mb-8">
                {activeLesson.type === 'video' ? (
                  <VideoPlayer 
                    publicId={activeLesson.cloudinary_public_id}
                    url={activeLesson.video_url}
                    title={activeLesson.title}
                    onEnded={handleLessonComplete}
                  />
                ) : (
                  <div className="p-8 prose prose-invert max-w-none min-h-[400px]">
                    {activeLesson.content ? (
                      <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                    ) : (
                      <p className="text-text-muted text-center pt-20">لا يوجد محتوى نصي.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-6 glass-card mb-20 md:mb-0">
                <Button 
                  variant={isCompleted(activeLesson.id) ? 'secondary' : 'primary'} 
                  onClick={handleLessonComplete}
                  leftIcon={<CheckCircle className="w-5 h-5" />}
                  className={isCompleted(activeLesson.id) ? 'text-accent border-accent/50' : ''}
                >
                  {isCompleted(activeLesson.id) ? 'مكتمل' : 'اكتمال ومتابعة'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted">
              اختر درساً للبدء
            </div>
          )}
        </div>

        {/* Sidebar Curriculum */}
        <div className={`
          w-80 border-r border-white/10 bg-surface-2 flex flex-col shrink-0 transition-transform duration-300
          absolute lg:relative right-0 h-full z-40
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 hidden lg:flex'}
        `}>
          <div className="p-4 border-b border-white/5 text-sm font-bold text-text-secondary sticky top-0 bg-surface-2 z-10">
            محتوى الدورة
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {course.modules?.map((mod: any, i: number) => (
              <div key={mod.id} className="space-y-2">
                <h3 className="font-bold text-sm bg-surface-3 p-3 rounded-lg border border-white/5 flex gap-2">
                  <span className="text-primary-light">الفصل {i + 1}:</span>
                  {mod.title}
                </h3>
                <div className="space-y-1 pl-4">
                  {mod.lessons?.map((lesson: any) => {
                    const active = activeLesson?.id === lesson.id
                    const completed = isCompleted(lesson.id)

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson)
                          if (window.innerWidth < 1024) setSidebarOpen(false)
                        }}
                        className={`
                          w-full text-right p-3 rounded-xl flex items-start gap-3 transition-all text-sm
                          ${active ? 'bg-primary/20 text-primary-light font-bold border border-primary/20' : 'hover:bg-white/5 text-text-secondary'}
                        `}
                      >
                        <div className="mt-0.5 shrink-0">
                          {completed ? (
                            <CheckCircle className="w-4 h-4 text-accent" />
                          ) : lesson.type === 'video' ? (
                            <PlayCircle className="w-4 h-4 opacity-50" />
                          ) : (
                            <FileText className="w-4 h-4 opacity-50" />
                          )}
                        </div>
                        <span className="leading-snug">{lesson.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
