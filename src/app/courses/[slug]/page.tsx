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

  const learn  = course.what_you_learn || []
  const reqs   = course.requirements   || []

  const iconProps = { size:15, style:{ color:'var(--gold)', flexShrink:0 } }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      {/* Hero */}
      <div className="hero-wrap" style={{padding:'40px 0 48px'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'flex',flexDirection:'row',gap:40,flexWrap:'wrap'}}>

            {/* Left info */}
            <div style={{flex:'1 1 400px'}}>
              <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
                {course.category?.name_ar && <span className="badge badge-gold">{course.category.name_ar}</span>}
                <span className="badge" style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)'}}>{getLevelLabel(course.level)}</span>
              </div>
              <h1 style={{fontSize:'clamp(24px,3.5vw,42px)',fontWeight:900,color:'#fff',marginBottom:14,lineHeight:1.2}}>{course.title}</h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,.6)',marginBottom:20,lineHeight:1.75}}>{course.description||course.short_description}</p>

              <div style={{display:'flex',flexWrap:'wrap',gap:16,fontSize:13,color:'rgba(255,255,255,.5)',marginBottom:22}}>
                <span style={{display:'flex',alignItems:'center',gap:5}}><Star size={14} style={{fill:'var(--gold)',color:'var(--gold)'}}/><b style={{color:'#fff'}}>{course.avg_rating||'جديد'}</b>{course.total_reviews>0&&<span>({course.total_reviews})</span>}</span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><Users size={13}/>{course.total_students} طالب</span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><Clock size={13}/>{formatDuration(course.duration_hours)}</span>
                <span style={{display:'flex',alignItems:'center',gap:5}}><BookOpen size={13}/>{course.total_lessons} درس</span>
              </div>

              {/* Teacher */}
              <div style={{display:'inline-flex',alignItems:'center',gap:12,padding:'10px 16px',borderRadius:12,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.1)'}}>
                <div style={{width:40,height:40,borderRadius:'50%',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,background:'linear-gradient(135deg,#b8912a,#d4a843)',color:'#fff',flexShrink:0}}>
                  {course.teacher?.avatar_url ? <img src={course.teacher.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : course.teacher?.full_name?.[0]||'م'}
                </div>
                <div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:2}}>مقدم الدورة</div>
                  <div style={{fontWeight:700,fontSize:14,color:'#fff'}}>{course.teacher?.full_name}</div>
                </div>
              </div>
            </div>

            {/* Purchase card */}
            <div style={{width:340,flexShrink:0,alignSelf:'flex-start',position:'sticky',top:90}}>
              <div className="card" style={{overflow:'hidden',boxShadow:'var(--shadow3)'}}>
                <div style={{position:'relative',aspectRatio:'16/9',background:'var(--bg3)'}}>
                  {course.thumbnail_url
                    ? <img src={course.thumbnail_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1c1c2e,#2a2a42)'}}><Video size={40} style={{color:'rgba(212,168,67,.3)'}}/></div>}
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.35)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.opacity='1')} onMouseLeave={e=>(e.currentTarget.style.opacity='0')}>
                    <PlayCircle size={48} style={{color:'#fff'}}/>
                  </div>
                </div>
                <div style={{padding:22}}>
                  <div style={{marginBottom:16}}>
                    <span style={{fontSize:28,fontWeight:900,color:'var(--gold)'}}>{formatPrice(course.price,course.currency)}</span>
                    {course.original_price>course.price && <span style={{fontSize:14,color:'var(--txt3)',textDecoration:'line-through',marginRight:8}}>{formatPrice(course.original_price,course.currency)}</span>}
                  </div>
                  <EnrollButton courseId={course.id} price={course.price||0} isEnrolled={isEnrolled} slug={course.slug}/>
                  <div style={{paddingTop:16,borderTop:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:10}}>
                    <p style={{fontWeight:800,fontSize:13,color:'var(--txt1)',marginBottom:4}}>تشمل هذه الدورة:</p>
                    {[[Video,`${formatDuration(course.duration_hours)} من الفيديو`],[BookOpen,`${course.total_lessons} دروس تفاعلية`],[GraduationCap,'اختبارات لتقييم المستوى'],...(course.certificate_enabled?[[ShieldCheck,'شهادة إتمام معتمدة']]:[])] .map(([Icon,text]:any,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:9,fontSize:13,color:'var(--txt2)'}}>
                        <Icon {...iconProps}/>{text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:1280,margin:'0 auto',padding:'40px 20px'}}>
        <div style={{maxWidth:760}}>

          {learn.length>0 && (
            <div className="card" style={{padding:28,marginBottom:24}}>
              <h2 style={{fontSize:20,fontWeight:900,marginBottom:14,color:'var(--txt1)'}}>ماذا ستتعلم؟</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
                {learn.map((item:string,i:number)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9}}>
                    <CheckCircle size={15} style={{color:'var(--gold)',flexShrink:0,marginTop:3}}/>
                    <span style={{fontSize:13.5,color:'var(--txt2)',lineHeight:1.6}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reqs.length>0 && (
            <div style={{marginBottom:24}}>
              <h2 style={{fontSize:20,fontWeight:900,marginBottom:12,color:'var(--txt1)'}}>المتطلبات</h2>
              <ul style={{display:'flex',flexDirection:'column',gap:8}}>
                {reqs.map((r:string,i:number)=>(
                  <li key={i} style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:14,color:'var(--txt2)'}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)',flexShrink:0,marginTop:7}}/>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          <div>
            <h2 style={{fontSize:20,fontWeight:900,marginBottom:6,color:'var(--txt1)'}}>محتوى الدورة</h2>
            <p style={{fontSize:13,color:'var(--txt3)',marginBottom:18}}>{course.modules?.length||0} فصول · {course.total_lessons} درس · {formatDuration(course.duration_hours)}</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {course.modules?.map((mod:any,i:number)=>(
                <div key={mod.id} className="card" style={{overflow:'hidden'}}>
                  <div style={{padding:'13px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--bg2)',borderBottom:'1px solid var(--border)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,background:'var(--gold-bg)',color:'var(--gold)'}}>{i+1}</span>
                      <span style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>{mod.title}</span>
                    </div>
                    <span style={{fontSize:12,color:'var(--txt3)'}}>{mod.lessons?.length||0} دروس</span>
                  </div>
                  {mod.lessons?.map((lesson:any)=>(
                    <div key={lesson.id} style={{padding:'11px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)',transition:'background .15s'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='var(--bg2)')}
                      onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                      <div style={{display:'flex',alignItems:'center',gap:9}}>
                        <PlayCircle size={14} style={{color:'var(--txt3)',flexShrink:0}}/>
                        <span style={{fontSize:13.5,color:'var(--txt2)'}}>{lesson.title}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        {lesson.is_preview && <span className="badge badge-gold" style={{fontSize:10}}>مجانية</span>}
                        {lesson.video_duration>0 && <span style={{fontSize:12,color:'var(--txt3)'}}>{Math.round(lesson.video_duration/60)} د</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
