'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Loader2, Users, BookOpen, Star, Globe, Twitter, Linkedin, Stethoscope } from 'lucide-react'

export default function TeacherProfilePage() {
  const { id }    = useParams<{ id: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase  = createSupabaseBrowserClient()

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data: p } = await supabase
        .from('profiles').select('*').eq('id', id).eq('role','teacher').maybeSingle()
      setProfile(p)
      if (p) {
        const { data: c } = await supabase
          .from('courses')
          .select('*, category:categories(name_ar)')
          .eq('teacher_id', id).eq('status','published')
          .order('total_students', { ascending: false })
        setCourses(c || [])
      }
      setLoading(false)
    })()
  }, [id])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0',background:'var(--bg)',minHeight:'100vh'}}>
      <Loader2 size={32} className="spin" style={{color:'var(--brand)'}}/>
    </div>
  )
  if (!profile) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0',background:'var(--bg)',minHeight:'100vh',color:'var(--tx3)',fontSize:15}}>
      المعلم غير موجود
    </div>
  )

  const totalStudents = courses.reduce((s,c) => s + (c.total_students||0), 0)
  const avgRating     = courses.filter(c=>c.avg_rating>0).reduce((s,c,_,a)=>s+c.avg_rating/a.length,0)

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:60}}>

      {/* Header */}
      <div className="hero" style={{padding:'52px 0 48px'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center'}}>
            <div style={{width:88,height:88,borderRadius:'50%',overflow:'hidden',border:'3px solid rgba(14,165,233,.4)',flexShrink:0,background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,color:'#fff',boxShadow:'var(--shb)'}}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                : profile.full_name?.[0] || <Stethoscope size={32}/>}
            </div>
            <div>
              <h1 style={{fontSize:26,fontWeight:900,color:'#fff',letterSpacing:'-.02em',marginBottom:4}}>{profile.full_name}</h1>
              {profile.headline && <p style={{color:'rgba(255,255,255,.6)',fontSize:14}}>{profile.headline}</p>}
            </div>

            {/* Stats */}
            <div style={{display:'flex',gap:32,marginTop:8}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>{courses.length}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>دورة</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>{totalStudents}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>طالب</div>
              </div>
              {avgRating > 0 && (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>⭐ {avgRating.toFixed(1)}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>التقييم</div>
                </div>
              )}
            </div>

            {/* Social */}
            <div style={{display:'flex',gap:12}}>
              {profile.website  && <a href={profile.website}  target="_blank" rel="noopener" style={{color:'rgba(255,255,255,.6)',display:'flex'}}><Globe  size={18}/></a>}
              {profile.twitter  && <a href={profile.twitter}  target="_blank" rel="noopener" style={{color:'rgba(255,255,255,.6)',display:'flex'}}><Twitter size={18}/></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener" style={{color:'rgba(255,255,255,.6)',display:'flex'}}><Linkedin size={18}/></a>}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{paddingTop:36}}>
        {/* Bio */}
        {profile.bio && (
          <div className="card" style={{padding:'22px 26px',marginBottom:28}}>
            <h2 style={{fontSize:15,fontWeight:700,color:'var(--tx1)',marginBottom:10}}>نبذة عن المعلم</h2>
            <p style={{fontSize:14,color:'var(--tx2)',lineHeight:1.8}}>{profile.bio}</p>
          </div>
        )}

        {/* Courses */}
        <h2 style={{fontSize:18,fontWeight:800,color:'var(--tx1)',marginBottom:20,letterSpacing:'-.01em'}}>
          دورات {profile.full_name} ({courses.length})
        </h2>
        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map(c => <CourseCard key={c.id} course={c}/>)}
          </div>
        ) : (
          <div className="card" style={{padding:48,textAlign:'center'}}>
            <BookOpen size={32} style={{color:'var(--tx4)',margin:'0 auto 12px'}}/>
            <p style={{color:'var(--tx3)',fontSize:14}}>لا توجد دورات منشورة حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
