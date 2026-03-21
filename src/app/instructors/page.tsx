'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Users, BookOpen, Star, Loader2, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function InstructorsPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id,full_name,avatar_url,headline,bio')
        .eq('role','teacher')
        .order('full_name')
      if (!data) { setLoading(false); return }

      const enriched = await Promise.all(data.map(async t => {
        const { count:total } = await supabase.from('courses')
          .select('*',{count:'exact',head:true}).eq('teacher_id',t.id).eq('status','published')
        const { data:stats } = await supabase.from('courses')
          .select('total_students,avg_rating').eq('teacher_id',t.id).eq('status','published')
        const students = stats?.reduce((s,c)=>s+(c.total_students||0),0)||0
        const ratings  = stats?.filter(c=>c.avg_rating>0)||[]
        const rating   = ratings.length>0 ? ratings.reduce((s,c)=>s+c.avg_rating,0)/ratings.length : 0
        return {...t, course_count:total||0, students, rating:Math.round(rating*10)/10}
      }))
      setTeachers(enriched); setLoading(false)
    })()
  },[])

  const filtered = teachers.filter(t =>
    !search || t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.headline?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:60}}>
      {/* Hero */}
      <div className="hero" style={{padding:'52px 0 48px',textAlign:'center'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div className="eyebrow"><Stethoscope size={11}/>فريق المعلمين</div>
          <h1 style={{fontSize:'clamp(24px,4vw,42px)',fontWeight:900,color:'#fff',letterSpacing:'-.02em',marginBottom:10}}>
            منصتنا تضم أفضل المعلمين
          </h1>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:15,maxWidth:480,margin:'0 auto 28px'}}>
            متخصصون معتمدون في جميع التخصصات الطبية
          </p>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ابحث عن معلم..."
            style={{maxWidth:400,width:'100%',padding:'11px 18px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
        </div>
      </div>

      <div className="wrap" style={{paddingTop:36}}>
        {loading
          ? <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={32} className="spin" style={{color:'var(--alpha-green)'}}/></div>
          : filtered.length===0
            ? <div className="card" style={{padding:56,textAlign:'center'}}>
                <Users size={36} style={{color:'var(--tx4)',margin:'0 auto 12px'}}/>
                <p style={{color:'var(--tx3)',fontSize:14}}>لا يوجد معلمون مطابقون</p>
              </div>
            : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:20}}>
                {filtered.map(t=>(
                  <Link key={t.id} href={`/teacher/${t.id}`} style={{textDecoration:'none'}}>
                    <div className="card" style={{overflow:'hidden',transition:'all .2s'}}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='var(--alpha-green-m)'}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='var(--brd)'}}>
                      {/* Header gradient */}
                      <div style={{height:70,background:'linear-gradient(135deg,#1B5E20,#2E7D32)',position:'relative'}}/>
                      {/* Avatar */}
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 16px 20px',marginTop:-32}}>
                        <div style={{width:64,height:64,borderRadius:'50%',overflow:'hidden',border:'3px solid #fff',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'0 2px 10px rgba(0,0,0,.15)',flexShrink:0}}>
                          {t.avatar_url
                            ? <img src={t.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                            : t.full_name?.[0]||'م'}
                        </div>
                        <h3 style={{fontSize:16,fontWeight:800,color:'var(--tx1)',marginTop:10,marginBottom:2,textAlign:'center'}}>{t.full_name}</h3>
                        {t.headline && <p style={{fontSize:12,color:'var(--tx3)',textAlign:'center',marginBottom:12}}>{t.headline}</p>}
                        <div style={{display:'flex',gap:16,fontSize:12,color:'var(--tx3)'}}>
                          <span style={{display:'flex',alignItems:'center',gap:4}}><BookOpen size={12}/>{t.course_count} دورة</span>
                          <span style={{display:'flex',alignItems:'center',gap:4}}><Users size={12}/>{t.students} طالب</span>
                          {t.rating>0 && <span style={{display:'flex',alignItems:'center',gap:4}}>⭐{t.rating}</span>}
                        </div>
                        <div className="alpha-btn alpha-btn-primary" style={{marginTop:14,fontSize:12,padding:'7px 20px',width:'100%',justifyContent:'center',display:'flex'}}>
                          عرض الدورات
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>}

        {/* Apply CTA */}
        <div style={{marginTop:48,background:'var(--alpha-green-l)',border:'1px solid var(--alpha-green-m)',borderRadius:14,padding:'32px 28px',textAlign:'center'}}>
          <h3 style={{fontSize:18,fontWeight:800,color:'var(--tx1)',marginBottom:8}}>هل تريد التدريس على منصتنا؟</h3>
          <p style={{fontSize:14,color:'var(--tx3)',marginBottom:18}}>سجّل طلبك الآن وانضم لفريق معلمينا المتميزين</p>
          <Link href="/apply-teacher" className="btn-register" style={{textDecoration:'none',display:'inline-flex',padding:'10px 24px'}}>
            تقديم طلب معلم
          </Link>
        </div>
      </div>
    </div>
  )
}
