'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Stethoscope, BookOpen, PlayCircle, Award, ChevronLeft,
         Brain, CheckCircle, Users, Clock, ArrowLeft, Sparkles } from 'lucide-react'

const SUBJECTS = [
  { icon:'🫀', name:'أمراض القلب',        color:'rgba(239,68,68,.12)',    tc:'#F87171' },
  { icon:'🧠', name:'طب الأعصاب',         color:'rgba(167,139,250,.12)',  tc:'#A78BFA' },
  { icon:'🦷', name:'طب الأسنان',         color:'rgba(52,211,153,.12)',   tc:'#34D399' },
  { icon:'💊', name:'الصيدلة السريرية',   color:'rgba(96,165,250,.12)',   tc:'#60A5FA' },
  { icon:'🧬', name:'علم الأحياء الجزيئي',color:'rgba(249,115,22,.12)',  tc:'#FB923C' },
  { icon:'🫁', name:'أمراض الصدر',        color:'rgba(34,211,238,.12)',   tc:'#22D3EE' },
  { icon:'🩺', name:'طب الطوارئ',         color:'rgba(251,191,36,.12)',   tc:'#FBB324' },
  { icon:'🔬', name:'علم الأمراض',        color:'rgba(236,72,153,.12)',   tc:'#EC4899' },
]

const WHY = [
  { icon:'📚', t:'محتوى أكاديمي دقيق',   d:'كل مادة مُعدّة وفق المناهج الطبية المعتمدة.' },
  { icon:'🎬', t:'شرح بالفيديو',          d:'دروس مرئية واضحة قابلة للمراجعة في أي وقت.' },
  { icon:'✅', t:'اختبارات تفاعلية',      d:'أسئلة MCQ بعد كل درس لقياس الفهم فوراً.' },
  { icon:'🏆', t:'شهادة إتمام',           d:'تُصدر تلقائياً عند إكمال الدورة بنجاح.' },
]

export default function Home() {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    const sb = createSupabaseBrowserClient()
    sb.from('courses')
      .select('id,title,slug,thumbnail_url,price,currency,level,total_lessons,avg_rating,total_students,profiles(full_name)')
      .eq('status','published')
      .order('total_students',{ascending:false})
      .limit(6)
      .then(({ data }) => { if (data) setCourses(data) })
  },[])

  return (
    <div style={{background:'var(--bg)'}}>

      {/* ════ HERO ════ */}
      <section className="hero" style={{padding:'96px 0 80px',textAlign:'center'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 14px',borderRadius:99,background:'rgba(124,58,237,.15)',border:'1px solid rgba(124,58,237,.3)',marginBottom:24}}>
            <Sparkles size={12} style={{color:'#A78BFA'}}/>
            <span style={{fontSize:12,fontWeight:700,color:'#A78BFA',letterSpacing:'.06em'}}>منصة التعليم الطبي المتخصصة</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,5.5vw,64px)',fontWeight:900,color:'#fff',lineHeight:1.05,letterSpacing:'-.03em',marginBottom:20}}>
            تعلّم الطب بأسلوب<br/>
            <span className="g-text">أكاديمي احترافي</span>
          </h1>
          <p style={{fontSize:17,color:'rgba(255,255,255,.5)',maxWidth:500,margin:'0 auto 36px',lineHeight:1.85}}>
            دورات طبية متخصصة بشرح مبسّط وتمارين تفاعلية ونظام اختبارات متطور
            — صُمّمت خصيصاً لطلاب الطب والمتخصصين الصحيين.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
              <PlayCircle size={18}/>ابدأ التعلم مجاناً
            </Link>
            <Link href="/about" className="btn btn-xl" style={{textDecoration:'none',background:'rgba(255,255,255,.07)',color:'rgba(255,255,255,.8)',border:'1.5px solid rgba(255,255,255,.15)'}}>
              اعرف المزيد <ArrowLeft size={16}/>
            </Link>
          </div>

          {/* mini stats */}
          <div style={{display:'flex',gap:36,justifyContent:'center',marginTop:52,flexWrap:'wrap'}}>
            {[['📚','دورات طبية'],['🎬','دروس مرئية'],['✅','اختبارات'],['🏆','شهادات']].map(([ic,lb],i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:20}}>{ic}</span>
                <span style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.5)'}}>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SUBJECTS ════ */}
      <section style={{padding:'56px 0',borderBottom:'1px solid var(--brd)'}}>
        <div className="wrap">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
            <h2 style={{fontSize:20,fontWeight:800,color:'var(--tx1)',letterSpacing:'-.015em'}}>التخصصات الطبية</h2>
            <Link href="/courses" style={{display:'flex',alignItems:'center',gap:5,fontSize:13,fontWeight:700,color:'var(--brand-2)',textDecoration:'none'}}>
              عرض الكل <ChevronLeft size={15}/>
            </Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10}}>
            {SUBJECTS.map((s,i)=>(
              <Link key={i} href="/courses" style={{textDecoration:'none'}}>
                <div style={{background:s.color,border:`1px solid ${s.tc}33`,borderRadius:12,padding:'18px 14px',textAlign:'center',cursor:'pointer',transition:'all .18s'}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-2px)';el.style.borderColor=s.tc+'66'}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor=s.tc+'33'}}>
                  <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:11.5,fontWeight:700,color:s.tc,lineHeight:1.3}}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ COURSES ════ */}
      {courses.length > 0 && (
        <section style={{padding:'56px 0',borderBottom:'1px solid var(--brd)'}}>
          <div className="wrap">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
              <h2 style={{fontSize:20,fontWeight:800,color:'var(--tx1)',letterSpacing:'-.015em'}}>الدورات المتاحة</h2>
              <Link href="/courses" style={{display:'flex',alignItems:'center',gap:5,fontSize:13,fontWeight:700,color:'var(--brand-2)',textDecoration:'none'}}>
                عرض الكل <ChevronLeft size={15}/>
              </Link>
            </div>
            <div className="courses-grid">
              {courses.map((c:any)=>(
                <Link key={c.id} href={`/courses/${c.slug}`} style={{textDecoration:'none'}}>
                  <div className="card" style={{overflow:'hidden',transition:'all .2s'}}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='rgba(124,58,237,.3)';el.style.boxShadow='var(--sh3)'}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='var(--brd)';el.style.boxShadow='var(--sh1)'}}>
                    <div style={{height:155,background:c.thumbnail_url?`url(${c.thumbnail_url}) center/cover`:'linear-gradient(135deg,#1A0533,#2D1B69)',position:'relative',overflow:'hidden'}}>
                      {!c.thumbnail_url && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,opacity:.3}}>🎬</div>}
                      {c.price===0 && <span style={{position:'absolute',top:10,right:10,background:'#10B981',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:5}}>مجاني</span>}
                    </div>
                    <div style={{padding:'14px 16px'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--tx1)',marginBottom:5,lineHeight:1.4}}>{c.title}</div>
                      <div style={{fontSize:12,color:'var(--tx3)',marginBottom:12}}>{c.profiles?.full_name||'معلم'}</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--tx3)'}}>
                          <BookOpen size={12}/>{c.total_lessons||0} درس
                        </span>
                        <span style={{fontSize:15,fontWeight:800,color:c.price===0?'#10B981':'var(--brand-2)'}}>
                          {c.price===0?'مجاني':`${c.price} ${c.currency||'USD'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ WHY ════ */}
      <section style={{padding:'56px 0',borderBottom:'1px solid var(--brd)'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:40}}>
            <div className="eyebrow"><Brain size={11}/>لماذا نختارنا</div>
            <h2 className="sec-title">مبنية للطالب الطبي</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:18}}>
            {WHY.map(({icon,t,d},i)=>(
              <div key={i} style={{background:'var(--surface)',border:'1px solid var(--brd)',borderRadius:14,padding:'26px 22px',borderTop:`3px solid var(--brand)`,transition:'all .2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--sh2)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
                <div style={{fontSize:28,marginBottom:14}}>{icon}</div>
                <h3 style={{fontSize:15,fontWeight:800,color:'var(--tx1)',marginBottom:8,letterSpacing:'-.01em'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--tx3)',lineHeight:1.75}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{padding:'60px 0'}}>
        <div className="wrap">
          <div style={{background:'var(--surface)',border:'1px solid var(--brand-m)',borderRadius:20,padding:'52px 40px',textAlign:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 60% at 50% 0%,rgba(124,58,237,.12) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{width:56,height:56,borderRadius:14,background:'var(--brand-l)',border:'1px solid var(--brand-m)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                <Stethoscope size={26} style={{color:'var(--brand-2)'}}/>
              </div>
              <h2 style={{fontSize:'clamp(20px,3vw,34px)',fontWeight:900,color:'var(--tx1)',marginBottom:12,letterSpacing:'-.02em'}}>
                ابدأ رحلتك الطبية الآن
              </h2>
              <p style={{fontSize:15,color:'var(--tx3)',marginBottom:28,maxWidth:400,margin:'0 auto 28px',lineHeight:1.8}}>
                سجّل مجاناً وابدأ بالدورات الطبية المتاحة فوراً.
              </p>
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <Link href="/auth/register" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
                  إنشاء حساب مجاني
                </Link>
                <Link href="/courses" className="btn btn-outline btn-xl" style={{textDecoration:'none'}}>
                  <BookOpen size={16}/>الدورات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{borderTop:'1px solid var(--brd)',padding:'28px 0'}}>
        <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:30,height:30,borderRadius:8,background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Stethoscope size={15} style={{color:'#fff'}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:'var(--tx1)'}}>منصة تعلّم الطبية</span>
          </div>
          <nav style={{display:'flex',gap:20,fontSize:13,flexWrap:'wrap'}}>
            {[['الدورات','/courses'],['من نحن','/about'],['الأسئلة الشائعة','/faq'],['تواصل','/contact'],['الشروط','/terms'],['الخصوصية','/privacy']].map(([l,h])=>(
              <Link key={h} href={h} style={{color:'var(--tx3)'}}>{l}</Link>
            ))}
          </nav>
          <span style={{fontSize:12,color:'var(--tx4)'}}>© 2026 منصة تعلّم الطبية</span>
        </div>
      </footer>
    </div>
  )
}
