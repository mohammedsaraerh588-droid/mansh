import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDuration, getLevelLabel } from '@/lib/utils'
import { PlayCircle, Clock, BookOpen, Users, Star, CheckCircle, ShieldCheck, GraduationCap, Video, ExternalLink } from 'lucide-react'
import EnrollButton from '@/components/courses/EnrollButton'
import CourseRating from '@/components/courses/CourseRating'
import WishlistButton from '@/components/ui/WishlistButton'
import Link from 'next/link'

export const revalidate = 60

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: courseData, error } = await supabase
    .from('courses').select('*,teacher:profiles(id,full_name,avatar_url,headline),category:categories(name_ar,slug)')
    .eq('slug', slug).single()

  let course = courseData
  if (!course && error) {
    const { data: alt } = await supabase
      .from('courses').select('*,teacher:profiles(id,full_name,avatar_url,headline),category:categories(name_ar,slug)')
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
  let userId = ''
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    userId = session.user.id
    const { data: enr } = await supabase.from('enrollments').select('payment_status')
      .eq('student_id', session.user.id).eq('course_id', course.id).single()
    if (enr && ['completed','free'].includes(enr.payment_status)) isEnrolled = true
  }

  const learn       = course.what_you_learn || []
  const reqs        = course.requirements   || []
  const hasDiscount = course.original_price && Number(course.original_price) > Number(course.price)

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>

      {/* ── Hero ── */}
      <div className="hero" style={{padding:'48px 0 56px'}}>
        <div className="wrap">
          <div style={{display:'flex', gap:40, flexWrap:'wrap', alignItems:'flex-start'}}>

            {/* Info */}
            <div style={{flex:'1 1 380px'}}>
              <div style={{display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center'}}>
                {course.category?.name_ar && (
                  <Link href={`/category/${course.category.slug||''}`} style={{textDecoration:'none'}}>
                    <span className="badge badge-teal" style={{cursor:'pointer'}}>{course.category.name_ar}</span>
                  </Link>
                )}
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)'}}>
                  {getLevelLabel(course.level)}
                </span>
              </div>
              <h1 style={{fontSize:'clamp(22px,3.5vw,40px)', fontWeight:900, color:'#fff', marginBottom:12, lineHeight:1.2}}>
                {course.title}
              </h1>
              <p style={{fontSize:15, color:'rgba(255,255,255,.6)', marginBottom:18, lineHeight:1.75}}>
                {course.description || course.short_description}
              </p>
              <div style={{display:'flex', flexWrap:'wrap', gap:14, fontSize:13, color:'rgba(255,255,255,.5)', marginBottom:20}}>
                <span style={{display:'flex',alignItems:'center',gap:5}}>
                  <Star size={13} style={{fill:'#fbbf24',color:'#fbbf24'}}/>
                  <b style={{color:'#fff'}}>{course.avg_rating || 'جديد'}</b>
                  {course.total_reviews > 0 && <span>({course.total_reviews} تقييم)</span>}
                </span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><Users size={13}/>{course.total_students||0} طالب</span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><Clock size={13}/>{formatDuration(course.duration_hours)}</span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><BookOpen size={13}/>{course.total_lessons||0} درس</span>
              </div>
              {course.teacher?.full_name && (
                <Link href={`/teacher/${course.teacher.id}`} style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)',transition:'all .15s'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,color:'#fff',flexShrink:0}}>
                    {course.teacher.avatar_url
                      ? <img src={course.teacher.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      : course.teacher.full_name[0]}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:1}}>مقدم الدورة</div>
                    <div style={{fontWeight:700,fontSize:13,color:'#fff',display:'flex',alignItems:'center',gap:5}}>
                      {course.teacher.full_name}
                      <ExternalLink size={10} style={{opacity:.5}}/>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Purchase card */}
            <div style={{width:340, flexShrink:0, position:'sticky', top:90}}>
              <div className="card" style={{overflow:'hidden', boxShadow:'var(--sh3)'}}>
                <div style={{position:'relative', aspectRatio:'16/9', background:'var(--bg3)', overflow:'hidden'}}>
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1A1F3A,#0E2954)'}}>
                        <Video size={40} style={{color:'rgba(255,255,255,.15)'}}/>
                      </div>}
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <PlayCircle size={44} style={{color:'rgba(255,255,255,.8)'}}/>
                  </div>
                </div>
                <div style={{padding:20}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                    <div>
                      <span style={{fontSize:26,fontWeight:900,color:'var(--brand)'}}>{formatPrice(course.price,course.currency)}</span>
                      {hasDiscount && (
                        <span style={{fontSize:13,color:'var(--tx3)',textDecoration:'line-through',marginRight:8}}>
                          {formatPrice(course.original_price,course.currency)}
                        </span>
                      )}
                    </div>
                    {session && <WishlistButton courseId={course.id}/>}
                  </div>
                  <EnrollButton courseId={course.id} price={course.price||0} isEnrolled={isEnrolled} slug={course.slug}/>
                  <div style={{paddingTop:14,borderTop:'1px solid var(--brd)',display:'flex',flexDirection:'column',gap:9,marginTop:10}}>
                    <p style={{fontWeight:800,fontSize:12,color:'var(--tx1)',marginBottom:2}}>تشمل هذه الدورة:</p>
                    {[
                      [Video,      `${formatDuration(course.duration_hours)} فيديو`],
                      [BookOpen,   `${course.total_lessons||0} درس`],
                      [GraduationCap, 'اختبارات تقييمية'],
                      ...(course.certificate_enabled ? [[ShieldCheck,'شهادة إتمام رقمية']] : []),
                    ].map(([Icon,text]:any,i:number) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--tx2)'}}>
                        <Icon size={14} style={{color:'var(--brand)',flexShrink:0}}/>{text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="wrap" style={{padding:'40px 20px'}}>
        <div style={{maxWidth:760}}>

          {learn.length > 0 && (
            <div className="card" style={{padding:26, marginBottom:22}}>
              <h2 style={{fontSize:18,fontWeight:900,marginBottom:14,color:'var(--tx1)'}}>ماذا ستتعلم؟</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:10}}>
                {learn.map((item:string,i:number) => (
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8}}>
                    <CheckCircle size={14} style={{color:'var(--ok)',flexShrink:0,marginTop:3}}/>
                    <span style={{fontSize:13.5,color:'var(--tx2)',lineHeight:1.6}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reqs.length > 0 && (
            <div style={{marginBottom:22}}>
              <h2 style={{fontSize:18,fontWeight:900,marginBottom:12,color:'var(--tx1)'}}>المتطلبات</h2>
              <ul style={{display:'flex',flexDirection:'column',gap:8}}>
                {reqs.map((r:string,i:number) => (
                  <li key={i} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:14,color:'var(--tx2)'}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'var(--brand)',flexShrink:0,marginTop:7}}/>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:18,fontWeight:900,marginBottom:4,color:'var(--tx1)'}}>محتوى الدورة</h2>
            <p style={{fontSize:13,color:'var(--tx3)',marginBottom:16}}>
              {course.modules?.length||0} فصول · {course.total_lessons||0} درس · {formatDuration(course.duration_hours)}
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {course.modules?.map((mod:any,i:number) => (
                <div key={mod.id} className="card" style={{overflow:'hidden'}}>
                  <div style={{padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--surface2)',borderBottom:'1px solid var(--brd)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{width:26,height:26,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,background:'var(--brand-l)',color:'var(--brand)',border:'1px solid var(--brand-m)'}}>{i+1}</span>
                      <span style={{fontWeight:700,fontSize:14,color:'var(--tx1)'}}>{mod.title}</span>
                    </div>
                    <span style={{fontSize:12,color:'var(--tx3)'}}>{mod.lessons?.length||0} دروس</span>
                  </div>
                  {mod.lessons?.map((lesson:any) => (
                    <div key={lesson.id} style={{padding:'11px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--brd)',background:'var(--surface)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <PlayCircle size={13} style={{color:'var(--tx3)',flexShrink:0}}/>
                        <span style={{fontSize:13.5,color:'var(--tx2)'}}>{lesson.title}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        {lesson.is_preview && <span className="badge badge-green" style={{fontSize:10}}>معاينة</span>}
                        {lesson.video_duration > 0 && <span style={{fontSize:12,color:'var(--tx3)'}}>{Math.round(lesson.video_duration/60)} د</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h2 style={{fontSize:18,fontWeight:900,marginBottom:18,color:'var(--tx1)'}}>التقييمات</h2>
            <CourseRating courseId={course.id} isEnrolled={isEnrolled}/>
          </div>
        </div>
      </div>
    </div>
  )
}
