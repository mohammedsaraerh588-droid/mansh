'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowRight, Save, Loader2, Video, FileText, CheckCircle2 } from 'lucide-react'
import VideoUploader from '@/components/ui/VideoUploader'

export default function LessonEditorPage() {
  const { id, lessonId } = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchLesson = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Verify course ownership first
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, teacher_id')
        .eq('id', id)
        .single()

      if (!courseData || courseData.teacher_id !== session.user.id) {
        router.push('/dashboard/teacher/courses')
        return
      }

      // Fetch lesson
      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .eq('course_id', id)
        .single()

      if (error || !lessonData) {
        router.push(`/dashboard/teacher/courses/${id}/curriculum`)
        return
      }

      setLesson(lessonData)
      setLoading(false)
    }

    fetchLesson()
  }, [id, lessonId])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSuccessMsg('')

    const updates = {
      title: lesson.title,
      content: lesson.content,
      is_preview: lesson.is_preview,
      type: lesson.type,
      video_url: lesson.video_url,
      cloudinary_public_id: lesson.cloudinary_public_id,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lesson.id)

    setSaving(false)
    if (!error) {
      setSuccessMsg('تم حفظ التغييرات بنجاح!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleVideoUploadSuccess = (url: string, publicId: string) => {
    setLesson((prev: any) => ({
      ...prev,
      type: 'video',
      video_url: url,
      cloudinary_public_id: publicId
    }))
    handleSave()
  }

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href={`/dashboard/teacher/courses/${id}/curriculum`}>
          <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            تعديل محتوى الدرس
          </h1>
          <p className="text-sm text-primary mt-1 font-medium">{lesson.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-2 text-secondary">المعلومات الأساسية</h3>
            <Input 
              label="عنوان الدرس"
              value={lesson.title}
              onChange={(e) => setLesson({...lesson, title: e.target.value})}
              required
            />
            
            <div className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-lg">
              <input 
                type="checkbox" 
                id="is_preview" 
                className="w-5 h-5 accent-primary rounded border-border"
                checked={lesson.is_preview}
                onChange={(e) => setLesson({...lesson, is_preview: e.target.checked})}
              />
              <div className="flex flex-col">
                <label htmlFor="is_preview" className="font-bold cursor-pointer select-none">معاينة مجانية</label>
                <span className="text-xs text-text-secondary">اسمح للطلاب بمشاهدة هذا الدرس مجاناً قبل الشراء.</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-2 flex justify-between items-center text-secondary">
              محتوى الدرس
              <div className="flex bg-surface-2 p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setLesson({...lesson, type: 'video'})}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${
                    lesson.type === 'video' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Video className="w-4 h-4" /> فيديو
                </button>
                <button
                  type="button"
                  onClick={() => setLesson({...lesson, type: 'text'})}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${
                    lesson.type === 'text' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <FileText className="w-4 h-4" /> نص
                </button>
              </div>
            </h3>

            {lesson.type === 'video' ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm">
                  <strong>تلميح:</strong> يمكنك رفع فيديو مباشرة أو وضع رابط من يوتيوب/خارجي.
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-text-secondary">رابط فيديو خارجي (YouTube أو رابط مباشر)</label>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lesson.video_url || ''}
                    onChange={(e) => setLesson({...lesson, video_url: e.target.value, cloudinary_public_id: null})}
                  />
                </div>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-4 text-text-muted text-sm">أو ارفع فيديو جديد</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <VideoUploader 
                  currentVideoUrl={lesson.cloudinary_public_id ? lesson.video_url : null} 
                  onSuccess={handleVideoUploadSuccess} 
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">المحتوى النصي</label>
                <textarea 
                  className="w-full min-h-[300px] p-4 rounded-xl border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y bg-surface-2"
                  placeholder="اكتب محتوى الدرس النصي هنا (يمكنك استخدام HTML)..."
                  value={lesson.content || ''}
                  onChange={(e) => setLesson({...lesson, content: e.target.value})}
                ></textarea>
                <p className="text-xs text-text-muted">يدعم التنسيق باستخدام وسوم HTML الأساسية.</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            {successMsg ? (
              <span className="text-success font-bold flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-lg text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </span>
            ) : <div></div>}
            
            <Button type="submit" variant="primary" isLoading={saving} className="px-8" leftIcon={<Save className="w-4 h-4"/>}>
              حفظ التغييرات
            </Button>
          </div>

        </form>
      </div>

    </div>
  )
}
