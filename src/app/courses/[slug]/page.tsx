import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDuration, getLevelLabel } from '@/lib/utils'
import { PlayCircle, Clock, BookOpen, Users, Star, CheckCircle, ShieldCheck, GraduationCap, Video } from 'lucide-react'
import EnrollButton from '@/components/courses/EnrollButton'

export const revalidate = 60

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: courseData, error: courseError } = await supabase
    .from('courses').select('*, teacher:profiles(full_name,avatar_url,headline), category:categories(name_ar)')
    .eq('slug', slug).single()

  let course = courseData
  if (!course && courseError) {
    const { data: alt } = await supabase
      .from('courses').select('*, teacher:profiles(full_name,avatar_url,headline), category:categories(name_ar)')
      .ilike('slug', `${slug}%`).single()
    if (alt) course = alt
  }
  if (!course) notFound()

  const { data: modules } = await supabase.from('modules').select('*').eq('course_id', course.id).order('position',{ascending:true})
  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase.from('lessons').select('*').eq('module_id', mod.id).order('position',{ascending:true})
      mod.lessons = lessons || []
    }
  }
  course.modules = modules || []

  let isEnrolled = false
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data: enr } = await supabase.from('enrollments').select('id,payment_status')
      .eq('student_id', session.user.id).eq('course_id', course.id).single()
    if (enr && (enr.payment_status === 'completed' || enr.payment_status === 'free')) isEnrolled = true
  }

  const whatYouLearn = course.what_you_learn || []
  const requirements = course.requirements || []

  return (
    <div className="min-h-screen pb-20" style={{background:'var(--surface)'}}>

      {/* Hero */}
      <div className="hero-bg pt-24 pb-16" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                {course.category?.name_ar && <span className="badge badge-gold">{course.category.name_ar}</span>}
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.8)'}}>{getLevelLabel(course.level)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight text-white">{course.title}</h1>
              <p className="text-lg mb-8 leading-relaxed" style={{color:'rgba(255,255,255,0.65)'}}>{course.description || course.short_description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm mb-8" style={{color:'rgba(255,255,255,0.5)'}}>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 fill-current" style={{color:'var(--gold)'}}/><span className="font-bold text-white">{course.avg_rating||'جديد'}</span>{course.total_reviews>0&&<span>({course.total_reviews} تقييم)</span>}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4"/><span>{course.total_students} طالب</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4"/><span>{formatDuration(course.duration_hours)}</span></div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4"/><span>{course.total_lessons} درس</span></div>
              </div>

              {/* Teacher */}
              <div className="inline-flex items-center gap-3 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-black text-sm" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>
                  {course.teacher?.avatar_url ? <img src={course.teacher.avatar_url} alt="" className="w-full h-full object-cover"/> : course.teacher?.full_name?.[0]||'م'}
                </div>
                <div>
                  <div className="text-xs mb-0.5" style={{color:'rgba(255,255,255,0.45)'}}>مقدم الدورة</div>
                  <div className="font-bold text-sm text-white">{course.teacher?.full_name}</div>
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:w-[380px] shrink-0">
              <div className="glass-card p-6 lg:-mt-8 lg:sticky lg:top-28 shadow-lg">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 group" style={{background:'var(--surface-3)'}}>
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    : <div className="w-full h-full flex items-center justify-center" style={{background:'var(--navy)'}}><Video className="w-12 h-12 opacity-20" style={{color:'var(--gold)'}}/></div>}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-14 h-14 text-white"/>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-black" style={{color:'var(--gold-dark)'}}>{formatPrice(course.price,course.currency)}</span>
                  {course.original_price && course.original_price > course.price && (
                    <span className="text-base line-through mr-2 font-normal" style={{color:'var(--text-muted)'}}>{formatPrice(course.original_price,course.currency)}</span>
                  )}
                </div>

                <EnrollButton courseId={course.id} price={course.price||0} isEnrolled={isEnrolled} slug={course.slug}/>

                <div className="space-y-3 pt-5 mt-5" style={{borderTop:'1px solid var(--border)'}}>
                  <h4 className="font-black mb-3" style={{color:'var(--text-primary)'}}>تشمل هذه الدورة:</h4>
                  {[
                    [Video, `${formatDuration(course.duration_hours)} من الفيديو عند الطلب`],
                    [BookOpen, `${course.total_lessons} دروس تفاعلية`],
                    [GraduationCap, 'اختبارات لتقييم المستوى'],
                    ...(course.certificate_enabled ? [[ShieldCheck, 'شهادة إتمام معتمدة']] : []),
                  ].map(([Icon, text]: any, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm" style={{color:'var(--text-secondary)'}}>
                      <Icon className="w-4 h-4 shrink-0" style={{color:'var(--gold)'}}/>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-10">

            {whatYouLearn.length > 0 && (
              <section className="glass-card p-8">
                <h2 className="text-2xl font-black mb-6" style={{color:'var(--text-primary)'}}>ماذا ستتعلم؟</h2>
                <div className="gold-separator mb-6" style={{margin:'0 0 24px'}} />
                <div className="grid sm:grid-cols-2 gap-4">
                  {whatYouLearn.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{color:'var(--gold)'}}/>
                      <span className="text-sm" style={{color:'var(--text-secondary)'}}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-black mb-5" style={{color:'var(--text-primary)'}}>المتطلبات</h2>
                <ul className="space-y-2">
                  {requirements.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{color:'var(--text-secondary)'}}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{background:'var(--gold)'}}/>
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-black mb-2" style={{color:'var(--text-primary)'}}>محتوى الدورة</h2>
              <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>
                {course.modules?.length||0} فصول · {course.total_lessons} درس · {formatDuration(course.duration_hours)}
              </p>
              <div className="space-y-3">
                {course.modules?.map((mod: any, i: number) => (
                  <div key={mod.id} className="glass-card overflow-hidden">
                    <div className="p-4 flex items-center justify-between font-bold" style={{background:'var(--surface-2)',borderBottom:'1px solid var(--border)'}}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{background:'var(--gold-bg)',color:'var(--gold-dark)'}}>{i+1}</span>
                        <span style={{color:'var(--text-primary)'}}>{mod.title}</span>
                      </div>
                      <span className="text-sm font-normal" style={{color:'var(--text-muted)'}}>{mod.lessons?.length||0} دروس</span>
                    </div>
                    <div style={{borderTop:'1px solid var(--border)'}}>
                      {mod.lessons?.map((lesson: any) => (
                        <div key={lesson.id} className="p-4 flex items-center justify-between group transition-colors" style={{borderBottom:'1px solid var(--border)'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-2)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 shrink-0" style={{color:'var(--text-muted)'}}/>
                            <span className="text-sm" style={{color:'var(--text-secondary)'}}>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {lesson.is_preview && <span className="badge badge-gold text-[10px]">مجانية</span>}
                            {lesson.video_duration>0 && <span className="text-xs" style={{color:'var(--text-muted)'}}>{Math.round(lesson.video_duration/60)} د</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="hidden lg:block w-[380px] shrink-0 pointer-events-none"/>
        </div>
      </div>
    </div>
  )
}
