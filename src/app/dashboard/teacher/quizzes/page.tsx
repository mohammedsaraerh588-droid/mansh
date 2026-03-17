'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { FileText, PlusCircle, BookOpen, CheckCircle, Loader2, Users } from 'lucide-react'

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get teacher courses first
      const { data: courses } = await supabase
        .from('courses').select('id, title').eq('teacher_id', session.user.id)

      if (!courses || courses.length === 0) { setLoading(false); return }

      const courseIds = courses.map((c: any) => c.id)

      // Get quizzes for these courses
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*, lessons(title, course_id)')
        .in('course_id', courseIds)

      // Attach course title
      const enriched = (quizData || []).map((q: any) => ({
        ...q,
        courseTitle: courses.find((c: any) => c.id === q.course_id)?.title || '',
      }))

      setQuizzes(enriched)
      setLoading(false)
    }
    fetchQuizzes()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1" style={{color:'var(--text-primary)'}}>الاختبارات</h1>
          <p className="text-sm" style={{color:'var(--text-secondary)'}}>إدارة اختبارات دوراتك التدريبية</p>
        </div>
        <Link href="/dashboard/teacher/courses">
          <button className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm">
            <PlusCircle className="w-4 h-4" /> إضافة اختبار
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'إجمالي الاختبارات', value: quizzes.length, icon: FileText },
          { label:'إجمالي الأسئلة',    value: quizzes.reduce((s,q)=>s+(q.questions?.length||0),0), icon: CheckCircle },
          { label:'متوسط درجة النجاح', value: quizzes.length ? Math.round(quizzes.reduce((s,q)=>s+(q.pass_mark||0),0)/quizzes.length)+'%' : '—', icon: Users },
        ].map((s,i)=>(
          <div key={i} className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:'var(--gold-bg)'}}>
              <s.icon className="w-5 h-5" style={{color:'var(--gold-dark)'}} />
            </div>
            <div>
              <div className="text-2xl font-black" style={{color:'var(--text-primary)'}}>{s.value}</div>
              <div className="text-xs" style={{color:'var(--text-secondary)'}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quizzes list */}
      {quizzes.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--surface-3)'}}>
            <FileText className="w-8 h-8" style={{color:'var(--text-muted)'}} />
          </div>
          <h3 className="text-xl font-black mb-2" style={{color:'var(--text-primary)'}}>لا توجد اختبارات بعد</h3>
          <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>أضف اختبارات لدروسك من خلال صفحة إدارة الدورات.</p>
          <Link href="/dashboard/teacher/courses">
            <button className="btn-gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 mx-auto">
              <BookOpen className="w-4 h-4" /> إدارة الدورات
            </button>
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead><tr>
              <th>عنوان الاختبار</th>
              <th>الدورة</th>
              <th className="text-center">درجة النجاح</th>
              <th className="text-center">المحاولات</th>
            </tr></thead>
            <tbody>
              {quizzes.map(q => (
                <tr key={q.id}>
                  <td className="font-bold" style={{color:'var(--text-primary)'}}>{q.title}</td>
                  <td style={{color:'var(--text-secondary)'}}>{q.courseTitle}</td>
                  <td className="text-center">
                    <span className="badge badge-gold">{q.pass_mark}%</span>
                  </td>
                  <td className="text-center" style={{color:'var(--text-secondary)'}}>{q.max_attempts || '∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
