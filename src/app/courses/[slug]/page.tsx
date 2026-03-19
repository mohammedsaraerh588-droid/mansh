import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDuration, getLevelLabel } from '@/lib/utils'
import { PlayCircle, Clock, BookOpen, Users, Star, CheckCircle, ShieldCheck, GraduationCap, Video } from 'lucide-react'
import EnrollButton from '@/components/courses/EnrollButton'

export const revalidate = 60

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: courseData, error } = await supabase
    .from('courses').select('*,teacher:profiles(full_name,avatar_url,headline),category:categories(name_ar)')
    .eq('slug', slug).single()

  let course = courseData
  if (!course && error) {
    const { data: alt } = await supabase
      .from('courses').select('*,teacher:profiles(full_name,avatar_url,headline),category:categories(name_ar)')
      .ilike('slug',`${slug}%`).single()
    if (alt) course = alt
  }
  if (!course) notFound()

  const { data: modules } = await supabase.from('modules').select('*').eq('course_id',course.id).order('position',{ascending:true})
  if (modules) {
    for (const mod of modules) {
      const { data: lessons } = await supabase.from('lessons').select('*').eq('module_id',mod.id).order('position',{ascending:true})
      mod.lessons = lessons || []
    }
  }
  course.modules = modules || []

  let isEnrolled = false
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data: enr } = await supabase.from('enrollments').select('payment_status')
      .eq('student_id',session.user.id).eq('course_id',course.id).single()
    if (enr && ['completed','free'].includes(enr.payment_status)) isEnrolled = true
  }

  const learn = course.what_you_learn || []
  const reqs  = course.requirements   || []
  const hasDiscount = course.original_price && Number(course.original_price) > Number(course.price)

  return (
    <div className="min-h-screen bg-bg pb-20">

      {/* ── Hero Section ── */}
      <div className="bg-navy pt-32 pb-40 relative overflow-hidden">
        {/* Decorative Mesh */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-mint/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        
        <div className="wrap relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Course Info */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                {course.category?.name_ar && (
                  <span className="px-3 py-1 rounded-lg bg-mint/10 text-mint text-[10px] font-black uppercase tracking-widest border border-mint/20">
                    {course.category.name_ar}
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {getLevelLabel(course.level)}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight md:leading-tight">
                {course.title}
              </h1>
              
              <p className="text-white/40 text-lg md:text-xl leading-relaxed italic font-serif">
                {course.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm font-bold">
                <div className="flex items-center gap-2">
                   <Star size={18} className="fill-gold text-gold" />
                   <span className="text-white font-black">{course.avg_rating || '5.0'}</span>
                   <span className="opacity-50 text-[11px]">({course.total_reviews || 0} تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                   <Users size={18} className="text-mint" />
                   <span>{course.total_students || 0} طالب</span>
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={18} className="text-mint" />
                   <span>{formatDuration(course.duration_hours)}</span>
                </div>
              </div>

              {course.teacher?.full_name && (
                <div className="inline-flex items-center gap-4 p-2 pl-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                   <div className="w-12 h-12 rounded-xl bg-mint/20 overflow-hidden ring-4 ring-white/5">
                      {course.teacher.avatar_url ? (
                        <img src={course.teacher.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-white">{course.teacher.full_name[0]}</div>
                      )}
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">المحاضر</div>
                      <div className="text-sm font-black text-white">{course.teacher.full_name}</div>
                   </div>
                </div>
              )}
            </div>

            {/* Sticky Card Container for Mobile (Hidden on Desktop, will use real sticky card) */}
            <div className="lg:col-span-5 relative">
              {/* Dynamic Floating Card - will be handled by sticky in desktop */}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="wrap relative -mt-32 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Learning Outcomes */}
            {learn.length > 0 && (
              <div className="card p-8 md:p-12 shadow-2xl shadow-navy/5 border-0">
                <div className="inline-flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-mint/10 flex items-center justify-center">
                      <GraduationCap className="text-mint" size={20} />
                   </div>
                   <h2 className="text-2xl font-black text-navy tracking-tight">ماذا ستتعلم في هذه الدورة؟</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {learn.map((item:string, i:number) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-6 h-6 rounded-lg bg-bg2 flex items-center justify-center flex-shrink-0 group-hover:bg-mint/10 transition-colors">
                        <CheckCircle size={14} className="text-navy/20 group-hover:text-mint" />
                      </div>
                      <span className="text-sm font-bold text-txt1/80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-navy tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-mint rounded-full" />
                    منهج الدورة
                  </h2>
                  <div className="text-[10px] font-black text-txt3 bg-white px-4 py-2 rounded-full border border-border shadow-sm uppercase tracking-widest">
                    {course.modules?.length || 0} فصول · {course.total_lessons || 0} دروس
                  </div>
                </div>

                <div className="space-y-4">
                  {course.modules?.map((mod:any, i:number) => (
                    <div key={mod.id} className="card overflow-hidden border-0 shadow-lg shadow-navy/5">
                      <div className="px-6 py-5 bg-navy flex justify-between items-center text-white">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center text-navy font-black text-xs">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-black text-base">{mod.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{mod.lessons?.length || 0} درس</span>
                      </div>
                      
                      <div className="bg-white divide-y divide-border">
                        {mod.lessons?.map((lesson:any) => (
                          <div key={lesson.id} className="flex items-center justify-between px-6 py-4 hover:bg-bg2 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-border/30 flex items-center justify-center group-hover:bg-navy transition-colors">
                                <PlayCircle size={14} className="text-txt3 group-hover:text-mint" />
                              </div>
                              <span className="text-sm font-bold text-txt1 group-hover:text-navy transition-colors">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              {lesson.is_preview && (
                                <span className="px-2 py-0.5 rounded-md bg-mint/10 text-mint text-[9px] font-black uppercase">عرض مجاني</span>
                              )}
                              {lesson.video_duration > 0 && (
                                <span className="text-[10px] font-bold text-txt3">{Math.round(lesson.video_duration/60)} د</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-6 pt-8">
               <h2 className="text-2xl font-black text-navy tracking-tight">وصف الدورة</h2>
               <div className="text-txt2 text-base leading-loose font-medium opacity-90" dangerouslySetInnerHTML={{__html: course.description || ''}} />
            </div>

            {/* Requirements */}
            {reqs.length > 0 && (
              <div className="space-y-6 pt-8">
                <h2 className="text-2xl font-black text-navy tracking-tight">المتطلبات الأساسية</h2>
                <div className="space-y-3">
                  {reqs.map((r:string, i:number) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-txt2 italic">
                       <CheckCircle size={16} className="text-mint" />
                       {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 lg:relative lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="card overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,18,51,0.15)] bg-white ring-1 ring-black/5">
                <div className="relative aspect-video group cursor-pointer overflow-hidden bg-navy">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy">
                      <Video size={48} className="text-mint/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-navy/20 group-hover:bg-navy/40 transition-all">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                       <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-navy border-b-[10px] border-b-transparent mr-[-4px]" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="flex items-end gap-3 justify-center md:justify-start">
                    <span className="text-4xl font-black text-navy tracking-tighter">
                      {formatPrice(course.price, course.currency)}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-txt3 font-bold line-through mb-1.5 opacity-50">
                        {formatPrice(course.original_price, course.currency)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <EnrollButton courseId={course.id} price={course.price||0} isEnrolled={isEnrolled} slug={course.slug} />
                    <p className="text-[10px] font-black text-txt3 text-center uppercase tracking-widest mt-2">ضمان استرجاع الأموال لمدة 30 يوماً</p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="text-xs font-black text-navy uppercase tracking-widest mb-2 px-1">محتويات الباقة الرسمية:</div>
                    {[
                      [Video, `${formatDuration(course.duration_hours)} من المحتوى الحصري`],
                      [BookOpen, `${course.total_lessons || 0} فصول تدريبية`],
                      [GraduationCap, 'اختبار نهائي وشهادة معتمدة'],
                      ...(course.certificate_enabled ? [[ShieldCheck, 'شهادة إتمام طبية']] : []),
                    ].map(([Icon, text]: any, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-txt2 opacity-80">
                        <Icon size={16} className="text-mint flex-shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
