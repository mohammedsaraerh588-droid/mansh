import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDuration, getLevelLabel } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PlayCircle, Clock, BookOpen, Users, Star, CheckCircle, ShieldCheck, GraduationCap, Video } from 'lucide-react'
import EnrollButton from '@/components/courses/EnrollButton'

export const revalidate = 60

export default async function CourseDetailsPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServerClient()

  let { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      teacher:profiles(full_name, avatar_url, headline),
      category:categories(name_ar),
      modules(
        id, title, description, position, lessons_count,
        lessons(id, title, type, video_duration, is_preview, position)
      )
    `)
    .eq('slug', params.slug)
    .single()

  // If course not found, try searching by a normalized slug pattern
  if (!course) {
    const { data: alternativeCourse } = await supabase
      .from('courses')
      .select(`
        *,
        teacher:profiles(full_name, avatar_url, headline),
        category:categories(name_ar),
        modules(
          id, title, description, position, lessons_count,
          lessons(id, title, type, video_duration, is_preview, position)
        )
      `)
      .ilike('slug', `${params.slug}%`)
      .single()
    
    if (alternativeCourse) {
      course = alternativeCourse
    }
  }

  if (!course) {
    notFound()
  }

  // Sort modules and lessons
  course.modules?.sort((a: any, b: any) => a.position - b.position)
  course.modules?.forEach((m: any) => {
    m.lessons?.sort((a: any, b: any) => a.position - b.position)
  })

  // Check enrollment status
  let isEnrolled = false
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, payment_status')
      .eq('student_id', session.user.id)
      .eq('course_id', course.id)
      .single()
      
    if (enrollment && (enrollment.payment_status === 'completed' || enrollment.payment_status === 'free')) {
      isEnrolled = true
    }
  }
  
  const whatYouLearn = course.what_you_learn || []
  const requirements = course.requirements || []

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-surface-2 pt-24 pb-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-2 opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Info */}
            <div className="flex-1 lg:pl-12">
              <div className="flex items-center gap-3 mb-6">
                {course.category?.name_ar && (
                  <span className="badge bg-primary/20 text-primary-light px-3 py-1">
                    {course.category.name_ar}
                  </span>
                )}
                <span className="badge bg-white/10 text-white px-3 py-1">
                  {getLevelLabel(course.level)}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                {course.description || course.short_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary fill-secondary" />
                  <span className="font-bold text-white">{course.avg_rating || 'جديد'}</span>
                  {course.total_reviews > 0 && <span>({course.total_reviews} تقييم)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 opacity-70" />
                  <span>{course.total_students} طالب</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 opacity-70" />
                  <span>{formatDuration(course.duration_hours)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 opacity-70" />
                  <span>{course.total_lessons} درس</span>
                </div>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 w-max">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-3 border border-white/10">
                  {course.teacher?.avatar_url ? (
                    <img src={course.teacher.avatar_url} alt="Teacher" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {course.teacher?.full_name?.[0] || 'م'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-text-muted mb-0.5">مقدم الدورة</div>
                  <div className="font-bold">{course.teacher?.full_name}</div>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar / Purchase Card */}
            <div className="lg:w-[400px] shrink-0">
              <div className="glass-card p-6 lg:-mt-32 relative z-20 shadow-2xl shadow-black/50 lg:sticky lg:top-32">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-surface-3 group">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Video className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="text-3xl font-black mb-6">
                  {formatPrice(course.price, course.currency)}
                  {course.original_price && course.original_price > course.price && (
                    <span className="text-lg text-text-muted line-through mr-3 font-normal">
                      {formatPrice(course.original_price, course.currency)}
                    </span>
                  )}
                </div>

                <EnrollButton 
                  courseId={course.id} 
                  price={course.price || 0} 
                  isEnrolled={isEnrolled} 
                  slug={course.slug} 
                />
                
                {!isEnrolled && course.price > 0 && (
                  <p className="text-center text-xs text-text-muted mb-6">تعلم آمن، انضم آلاف الطلاب</p>
                )}
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <h4 className="font-bold mb-4">تشمل هذه الدورة:</h4>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Video className="w-4 h-4 text-primary" />
                    <span>{formatDuration(course.duration_hours)} من الفيديو عند الطلب</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{course.total_lessons} دروس تفاعلية ومقالات</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>اختبارات لتقييم المستوى</span>
                  </div>
                  {course.certificate_enabled && (
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>شهادة إتمام معتمدة قابة للتحقق</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 lg:pl-12 space-y-12">
            
            {/* What you'll learn */}
            {whatYouLearn.length > 0 && (
              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6">ماذا ستتعلم في هذه الدورة؟</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {whatYouLearn.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">المتطلبات</h2>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  {requirements.map((req: string, i: number) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold mb-6">محتوى الدورة</h2>
              <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
                <span>{course.modules?.length || 0} فصول</span>
                <span>•</span>
                <span>{course.total_lessons} دروس</span>
                <span>•</span>
                <span>{formatDuration(course.duration_hours)} إجمالي الطول</span>
              </div>

              <div className="space-y-4">
                {course.modules?.map((mod: any, i: number) => (
                  <div key={mod.id} className="glass-card overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between font-bold">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">{i + 1}</span>
                        {mod.title}
                      </div>
                      <span className="text-sm font-normal text-text-muted">{mod.lessons?.length || 0} دروس</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {mod.lessons?.map((lesson: any, j: number) => (
                        <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                            <span className="text-sm text-text-secondary group-hover:text-white transition-colors">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {lesson.is_preview && (
                              <span className="badge badge-primary text-[10px]">معاينة مجانية</span>
                            )}
                            {lesson.video_duration > 0 && (
                              <span className="text-xs text-text-muted">{Math.round(lesson.video_duration / 60)} دقيقة</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
          
          {/* Spacer for sticky sidebar */}
          <div className="hidden lg:block w-[400px] shrink-0 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
