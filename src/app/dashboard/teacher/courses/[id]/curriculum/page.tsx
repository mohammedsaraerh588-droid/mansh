'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowRight, Plus, GripVertical, Video, FileText, Trash2, Edit2, CheckCircle2, Loader2, PlayCircle, BookOpen } from 'lucide-react'

export default function CurriculumManager() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [course, setCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State for new module creation
  const [isAddingModule, setIsAddingModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')

  // State for new lesson creation
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')

  useEffect(() => {
    fetchCurriculum()
  }, [id])

  const fetchCurriculum = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Verify ownership
    const { data: courseData } = await supabase
      .from('courses')
      .select('id, title, teacher_id')
      .eq('id', id)
      .single()

    if (!courseData || courseData.teacher_id !== session.user.id) {
      router.push('/dashboard/teacher/courses')
      return;
    }

    setCourse(courseData)

    // Fetch modules with lessons
    const { data: moduleData } = await supabase
      .from('modules')
      .select(`
        *,
        lessons(*)
      `)
      .eq('course_id', id)
      .order('position', { ascending: true })

    // Sort lessons inside modules
    if (moduleData) {
      moduleData.forEach(m => {
        m.lessons?.sort((a: any, b: any) => a.position - b.position)
      })
      setModules(moduleData)
    }
    
    setLoading(false)
  }

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return

    const newPosition = modules.length > 0 ? Math.max(...modules.map(m => m.position)) + 1 : 1

    const { data, error } = await supabase
      .from('modules')
      .insert({
        course_id: id,
        title: newModuleTitle.trim(),
        position: newPosition
      })
      .select()
      .single()

    if (!error && data) {
      setModules([...modules, { ...data, lessons: [] }])
      setNewModuleTitle('')
      setIsAddingModule(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفصل بجميع دروسه؟')) return
    
    // Optimistic UI
    setModules(modules.filter(m => m.id !== moduleId))
    await supabase.from('modules').delete().eq('id', moduleId)
  }

  const handleAddLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return

    const moduleIdx = modules.findIndex(m => m.id === moduleId)
    const targetModule = modules[moduleIdx]
    const newPosition = targetModule.lessons.length > 0 ? Math.max(...targetModule.lessons.map((l:any) => l.position)) + 1 : 1

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        course_id: id,
        title: newLessonTitle.trim(),
        position: newPosition,
        type: 'video', // Default
        is_free: false
      })
      .select()
      .single()

    if (!error && data) {
      const updatedModules = [...modules]
      updatedModules[moduleIdx].lessons.push(data)
      setModules(updatedModules)
      
      setAddingLessonTo(null)
      setNewLessonTitle('')
    }
  }

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return
    
    const updatedModules = [...modules]
    const mIdx = updatedModules.findIndex(m => m.id === moduleId)
    updatedModules[mIdx].lessons = updatedModules[mIdx].lessons.filter((l:any) => l.id !== lessonId)
    setModules(updatedModules)

    await supabase.from('lessons').delete().eq('id', lessonId)
  }

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href={`/dashboard/teacher/courses/${id}`}>
          <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            المنهج والدروس
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            إضافة وتنظيم فصول الدورة ومقاطع الفيديو ({course?.title})
          </p>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="text-center p-12 glass-card bg-white border border-border border-dashed">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4 border border-border">
              <BookOpen className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-bold mb-2">لا يوجد فصول حتى الآن</h3>
            <p className="text-text-secondary mb-6 text-sm">ابدأ ببناء منهجك من خلال إضافة الفصل الأول.</p>
            <Button variant="primary" onClick={() => setIsAddingModule(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة فصل جديد
            </Button>
          </div>
        ) : (
          modules.map((mod: any, mIdx: number) => (
            <div key={mod.id} className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              {/* Module Header */}
              <div className="bg-surface-2 p-4 flex items-center justify-between border-b border-border group">
                <div className="flex items-center gap-3">
                  <div className="cursor-move text-text-muted hover:text-text-primary p-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg">
                    <span className="text-primary-light ml-2 font-black">الفصل {mIdx + 1}:</span>
                    {mod.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDeleteModule(mod.id)} className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="p-4 bg-white">
                {mod.lessons?.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4 italic">لا توجد دروس في هذا الفصل. قم بإضافة درس جديد.</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {mod.lessons.map((lesson: any, lIdx: number) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary-light hover:bg-primary/5 transition-colors group bg-surface">
                        <div className="flex items-center gap-3">
                          <div className="cursor-move text-text-muted/50 hover:text-text-primary p-1">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            lesson.type === 'video' ? 'bg-primary-light text-primary-dark' : 'bg-surface-3 text-text-secondary'
                          }`}>
                            {lIdx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{lesson.title}</p>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1 font-medium">
                              {lesson.type === 'video' ? (
                                <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3"/> فيديو</span>
                              ) : (
                                <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> مقالة</span>
                              )}
                              {lesson.is_free && (
                                <span className="bg-success/10 text-success px-1.5 py-0.5 rounded text-[10px]">متاح مجاناً (معاينة)</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Lesson Actions */}
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/teacher/courses/${id}/curriculum/lesson/${lesson.id}`}>
                            <button className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors text-xs font-bold flex items-center gap-1">
                              <Edit2 className="w-3.5 h-3.5" />
                              تعديل ومحتوى
                            </button>
                          </Link>
                          <button onClick={() => handleDeleteLesson(mod.id, lesson.id)} className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Lesson inline form */}
                {addingLessonTo === mod.id ? (
                  <div className="flex items-center gap-2 mt-4 bg-surface p-3 rounded-lg border border-border">
                    <Input 
                      placeholder="عنوان الدرس الجديد..." 
                      className="flex-1 bg-white" 
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddLesson(mod.id)
                        if (e.key === 'Escape') setAddingLessonTo(null)
                      }}
                    />
                    <Button variant="primary" onClick={() => handleAddLesson(mod.id)} size="sm">إضافة</Button>
                    <Button variant="ghost" onClick={() => {
                        setAddingLessonTo(null);
                        setNewLessonTitle('');
                    }} size="sm">إلغاء</Button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      className="w-full text-text-secondary text-sm border-2 border-dashed border-border hover:border-primary hover:text-primary transition-all bg-surface-2" 
                      onClick={() => setAddingLessonTo(mod.id)}
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة درس لهذا الفصل
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Global Add Module Form / Button */}
        {modules.length > 0 && (
          isAddingModule ? (
             <div className="bg-white p-6 rounded-xl border-2 border-primary/30 shadow-sm border-dashed">
                <h3 className="font-bold text-lg mb-4 text-primary">إضافة فصل جديد</h3>
                <div className="flex items-center gap-3">
                  <Input 
                    placeholder="عنوان الفصل (مثال: مقدمة إلى البرمجة)" 
                    className="flex-1" 
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddModule()
                      if (e.key === 'Escape') setIsAddingModule(false)
                    }}
                  />
                  <Button variant="primary" onClick={handleAddModule}>إنشاء</Button>
                  <Button variant="ghost" onClick={() => {
                      setIsAddingModule(false);
                      setNewModuleTitle('');
                  }}>إلغاء</Button>
                </div>
            </div>
          ) : (
            <div className="pt-4 text-center">
              <Button variant="secondary" onClick={() => setIsAddingModule(true)} className="bg-white border-border shadow-sm">
                <Plus className="w-5 h-5 ml-2" />
                إضافة فصل جديد إضافي
              </Button>
            </div>
          )
        )}
      </div>
      
    </div>
  )
}
