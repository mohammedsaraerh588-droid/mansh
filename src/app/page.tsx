'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Stethoscope, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

const SUBJECTS = [
  { icon:'🫀', name:'أمراض القلب',         color:'#FFEBEE', tc:'#C62828' },
  { icon:'🧠', name:'طب الأعصاب',          color:'#EDE7F6', tc:'#4527A0' },
  { icon:'🦷', name:'طب الأسنان',          color:'#E8F5E9', tc:'#2E7D32' },
  { icon:'💊', name:'الصيدلة السريرية',    color:'#E3F2FD', tc:'#1565C0' },
  { icon:'🧬', name:'علم الأحياء الجزيئي', color:'#FFF3E0', tc:'#E65100' },
  { icon:'🫁', name:'أمراض الصدر',         color:'#E0F7FA', tc:'#006064' },
  { icon:'🩺', name:'طب الطوارئ',          color:'#FFF8E1', tc:'#F57F17' },
  { icon:'🔬', name:'علم الأمراض',         color:'#FCE4EC', tc:'#AD1457' },
  { icon:'🦴', name:'جراحة العظام',        color:'#F3E5F5', tc:'#6A1B9A' },
  { icon:'👁️', name:'طب العيون',           color:'#E8EAF6', tc:'#283593' },
  { icon:'🫄', name:'طب النساء والتوليد',  color:'#FCE4EC', tc:'#880E4F' },
  { icon:'🧪', name:'علم المختبرات',       color:'#E8F5E9', tc:'#1B5E20' },
]

const FAQS = [
  { q:'كيف يمكنني إنشاء حساب على المنصة؟', a:'اضغط على "إنشاء حساب" وأدخل بياناتك الصحيحة. بعد التسجيل يمكنك الوصول للدورات المجانية مباشرةً.' },
  { q:'كيفية الاشتراك بدورة من الدورات التعليمية؟', a:'تصفّح الدورات واضغط على الدورة التي تريدها، ثم اضغط "تسجيل" وأكمل عملية الدفع إن كانت مدفوعة.' },
  { q:'هل يمكنني مشاهدة الدروس من الهاتف؟', a:'نعم، المنصة متوافقة مع جميع الأجهزة — الهاتف والتابلت والحاسوب.' },
  { q:'هل يمكنني الحصول على شهادة إتمام؟', a:'نعم، عند إكمالك 100% من الدورة تُصدر شهادة رقمية تلقائياً في لوحة التحكم.' },
  { q:'كم عدد المرات المسموح بها لمشاهدة الدروس؟', a:'يمكنك مشاهدة الدروس بلا حدود في أي وقت طالما أنت مسجّل في الدورة.' },
]

export default function Home() {
  const [courses, setCourses]       = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [openFaq, setOpenFaq]       = useState<number|null>(0)
  const [carouselIdx, setCarouselIdx] = useState(0)

  const carouselItems = [
    { title: 'ابدأ رحلتك الطبية',   sub: 'تعلّم من أفضل المتخصصين الطبيين', bg: 'linear-gradient(135deg,#1B5E20,#2E7D32)' },
    { title: 'دورات طبية متخصصة',   sub: 'محتوى علمي دقيق مراجَع من متخصصين', bg: 'linear-gradient(135deg,#0D47A1,#1565C0)' },
    { title: 'اختبارات تفاعلية',     sub: 'قيّم فهمك بعد كل درس', bg: 'linear-gradient(135deg,#4A148C,#6A1B9A)' },
    { title: 'شهادات إتمام رقمية',  sub: 'تُصدر تلقائياً عند إكمال الدورة', bg: 'linear-gradient(135deg,#BF360C,#D84315)' },
  ]

  useEffect(() => {
    const sb = createSupabaseBrowserClient();
    (async () => {
      try {
        const { data } = await sb.from('courses')
          .select('id,title,slug,thumbnail_url,price,currency,level,total_lessons,avg_rating,total_students,profiles(full_name)')
          .eq('status','published')
          .order('total_students',{ascending:false})
          .limit(6)
        if (data) setCourses(data)
      } catch (e) {
        console.error('[HOME_COURSES]', e)
      } finally {
        setCoursesLoading(false)
      }
    })()
  },[])

  useEffect(() => {
    const t = setInterval(() => setCarouselIdx(i => (i+1) % carouselItems.length), 4000)
    return () => clearInterval(t)
  },[])

  return (
    <div>

      {/* ════ HERO SECTION ════ */}
      <section className="hero-section">
        <div className="alpha-container">
          <div style={{textAlign:'center', marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:18}}>
              <div style={{width:44,height:44,borderRadius:11,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px rgba(76,175,80,.4)'}}>
                <Stethoscope size={22} style={{color:'#fff'}}/>
              </div>
              <span style={{fontSize:22,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>
                منصة تعلّم<span style={{color:'var(--alpha-green)'}}> الطبية</span>
              </span>
            </div>
          </div>

          {/* Carousel */}
          <div style={{position:'relative',borderRadius:18,overflow:'hidden',boxShadow:'var(--sh3)',maxWidth:960,margin:'0 auto'}}>
            <div style={{background:carouselItems[carouselIdx].bg,minHeight:280,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px 40px',textAlign:'center',transition:'background .6s ease'}}>
              <div>
                <div style={{fontSize:'clamp(26px,4vw,44px)',fontWeight:900,color:'#fff',marginBottom:12,letterSpacing:'-.02em'}}>
                  {carouselItems[carouselIdx].title}
                </div>
                <div style={{fontSize:17,color:'rgba(255,255,255,.75)',marginBottom:28}}>
                  {carouselItems[carouselIdx].sub}
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                  <Link href="/courses" className="alpha-btn alpha-btn-tertiary" style={{textDecoration:'none',background:'#fff',color:'var(--tx1)',border:'none'}}>
                    استكشف الدورات
                  </Link>
                  <Link href="/auth/register" className="alpha-btn" style={{textDecoration:'none',background:'rgba(255,255,255,.15)',color:'#fff',border:'1.5px solid rgba(255,255,255,.4)'}}>
                    إنشاء حساب
                  </Link>
                </div>
              </div>
            </div>
            {/* arrows */}
            <button onClick={()=>setCarouselIdx(i=>(i-1+carouselItems.length)%carouselItems.length)} style={{position:'absolute',top:'50%',right:14,transform:'translateY(-50%)',width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.85)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--sh1)'}}>
              <ChevronRight size={18} style={{color:'var(--tx1)'}}/>
            </button>
            <button onClick={()=>setCarouselIdx(i=>(i+1)%carouselItems.length)} style={{position:'absolute',top:'50%',left:14,transform:'translateY(-50%)',width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.85)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--sh1)'}}>
              <ChevronLeft size={18} style={{color:'var(--tx1)'}}/>
            </button>
            {/* dots */}
            <div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',display:'flex',gap:7}}>
              {carouselItems.map((_,i)=>(
                <button key={i} onClick={()=>setCarouselIdx(i)} style={{width:i===carouselIdx?24:8,height:8,borderRadius:99,background:i===carouselIdx?'#fff':'rgba(255,255,255,.45)',border:'none',cursor:'pointer',transition:'all .2s',padding:0}}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ SEARCH SECTION ════ */}
      <section className="search-section">
        <div className="alpha-container">
          <div className="alpha-text-title-xl" style={{marginBottom:8}}>مستقبل طالب الطب يبدأ مع <span className="alpha-txt">منصة تعلّم الطبية</span></div>
          <div className="search-section-description">
            <div className="alpha-text-title-md">نحن روّاد التعليم الطبي الإلكتروني الذكي،</div>
            <div className="alpha-text-title-md">نقدم لك الطريق الموثوق نحو التميز والنجاح وشعارنا دائماً "الفهم أولاً"</div>
          </div>
          <div className="search-bar">
            <form method="get" action="/search">
              <input type="text" name="q" placeholder="ابحث عن دورة أو تخصص طبي..."/>
              <button className="search-btn" type="submit">ابحث</button>
            </form>
          </div>
        </div>
      </section>

      {/* ════ GRADES / SUBJECTS ════ */}
      <section className="grades-section">
        <div className="alpha-container">
          <div style={{textAlign:'center'}}>
            <div className="highlight">التخصصات الطبية</div>
            <div className="alpha-text-title-xl alpha-primary-2">جميع التخصصات من الأساسية إلى المتقدمة</div>
          </div>
          <div className="grades-grid">
            {SUBJECTS.map((s,i)=>(
              <Link key={i} href="/courses" style={{textDecoration:'none'}}>
                <div className="grade-card">
                  <div style={{fontSize:28,marginBottom:10}}>{s.icon}</div>
                  <div style={{fontSize:12.5,fontWeight:700,color:s.tc,lineHeight:1.3}}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ COURSES SECTION ════ */}
      {courses.length > 0 && (
        <section style={{padding:'60px 0', background:'var(--bg)'}}>
          <div className="alpha-container">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div className="highlight">الدورات المتاحة</div>
              <div className="alpha-text-title-xl alpha-primary-2">استكشف الدورات الطبية المنشورة</div>
            </div>
            <div className="courses-grid">
              {coursesLoading
                ? Array.from({length:6}).map((_,i)=>(
                    <div key={i} style={{borderRadius:14,overflow:'hidden',background:'var(--surface)',border:'1px solid var(--brd)'}}>
                      <div style={{height:165,background:'var(--surface3)',animation:'pulse 1.5s ease-in-out infinite'}}/>
                      <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:10}}>
                        <div style={{height:14,borderRadius:6,background:'var(--surface3)',animation:'pulse 1.5s ease-in-out infinite',width:'80%'}}/>
                        <div style={{height:12,borderRadius:6,background:'var(--surface3)',animation:'pulse 1.5s ease-in-out infinite',width:'50%'}}/>
                        <div style={{height:12,borderRadius:6,background:'var(--surface3)',animation:'pulse 1.5s ease-in-out infinite',width:'65%'}}/>
                      </div>
                    </div>
                  ))
                : courses.map((c:any)=>(
                <Link key={c.id} href={`/courses/${c.slug}`} style={{textDecoration:'none'}}>
                  <div className="main-card">
                    <div className="image-container" style={{height:165,background:c.thumbnail_url?undefined:'linear-gradient(135deg,#1B5E20,#388E3C)'}}>
                      {c.thumbnail_url
                        ? <img src={c.thumbnail_url} alt={c.title}/>
                        : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40}}>📚</div>}
                      {c.price===0 && <span style={{position:'absolute',top:10,right:10,background:'var(--alpha-green)',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:6}}>مجاني</span>}
                    </div>
                    <div className="info" style={{position:'relative'}}>
                      <span className="title">{c.title}</span>
                      <span style={{fontSize:12,color:'var(--tx3)',display:'block',marginBottom:10}}>{c.profiles?.full_name||'معلم'}</span>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--tx3)'}}>
                          <BookOpen size={12}/>{c.total_lessons||0} درس
                        </span>
                        <span style={{fontSize:16,fontWeight:900,color:c.price===0?'var(--alpha-green)':'var(--alpha-green-2)'}}>
                          {c.price===0?'مجاني':`${c.price} ${c.currency||'USD'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:28}}>
              <Link href="/courses" className="alpha-btn alpha-btn-primary alpha-text-body-bold" style={{textDecoration:'none'}}>
                عرض جميع الدورات
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════ STATS SECTION ════ */}
      <section className="stats-section">
        <div className="alpha-container">
          <div className="wave-container"/>
          <div className="highlight" style={{display:'inline-block'}}>إحصائيات</div>
          <div className="alpha-text-title-xl alpha-primary-2" style={{marginBottom:4}}>منصة تعلّم الطبية بلغة الأرقام</div>
          <div className="stats-grid">
            {[
              { n:'2024',         d:'تأسست عام' },
              { n:'دورات طبية',  d:'في جميع التخصصات' },
              { n:'معلم متخصص',  d:'مدرّس ذو خبرة عالية' },
              { n:'4.8 / 5.0',   d:'معدل تقييم الطلاب لنا' },
            ].map((s,i)=>(
              <div key={i} className="stats-box alpha-flex-col alpha-justify-center alpha-items-center">
                <span className="alpha-text-title-lg">{s.n}</span>
                <span className="alpha-text-body-paragraph">{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FAQ SECTION ════ */}
      <section className="faq-section">
        <div className="alpha-container">
          <div style={{textAlign:'center'}}>
            <div className="alpha-text-title-xl alpha-primary-2">الأسئلة الشائعة</div>
          </div>
          <div id="faq-grid">
            {FAQS.map((f,i)=>(
              <div key={i} className={`alpha-accordion faq ${openFaq===i?'active':''}`}>
                <div className="alpha-accordion-header" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span>{f.q}</span>
                  <span style={{fontSize:20,color:openFaq===i?'var(--alpha-green)':'var(--tx3)',fontWeight:300,flexShrink:0}}>
                    {openFaq===i?'−':'+'}
                  </span>
                </div>
                {openFaq===i && (
                  <div className="alpha-accordion-content">{f.a}</div>
                )}
              </div>
            ))}
            <div className="show-more-faq">
              <Link href="/faq" className="alpha-btn-nav">المزيد</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer>
        <div className="footer-content">
          <div className="alpha-flex-col">
            <div className="alpha-text-title-page">روابط سريعة</div>
            <ul className="alpha-text-body-sm">
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/courses">الدورات</Link></li>
              <li><Link href="/about">من نحن</Link></li>
            </ul>
          </div>
          <div className="alpha-flex-col">
            <div className="alpha-text-title-page">الدعم الفني</div>
            <ul className="alpha-text-body-sm">
              <li><Link href="/contact">تواصل معنا</Link></li>
              <li><Link href="/faq">الأسئلة الشائعة</Link></li>
              <li><Link href="/privacy">سياسة الخصوصية</Link></li>
              <li><Link href="/terms">الشروط والأحكام</Link></li>
            </ul>
          </div>
          <div className="alpha-flex-col">
            <div className="alpha-text-title-page">عن المنصة</div>
            <ul className="alpha-text-body-sm">
              <li><Link href="/about">من نحن</Link></li>
              <li>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                  <div style={{width:36,height:36,borderRadius:9,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Stethoscope size={18} style={{color:'#fff'}}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:800,color:'rgba(255,255,255,.8)'}}>منصة تعلّم الطبية</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-of-footer">
          جميع الحقوق محفوظة © 2026 منصة تعلّم الطبية
        </div>
      </footer>
    </div>
  )
}
