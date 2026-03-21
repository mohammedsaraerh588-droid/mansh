'use client'
import Link from 'next/link'
import { Stethoscope, BookOpen, CheckCircle, ShieldCheck,
         Brain, Activity, PlayCircle, ArrowLeft, GraduationCap,
         FlaskConical, Heart, Microscope, Pill } from 'lucide-react'

const specialties = [
  { icon:'🫀', label:'الطب الباطني',      color:'rgba(14,165,233,.15)' },
  { icon:'🧠', label:'طب الأعصاب',        color:'rgba(139,92,246,.15)' },
  { icon:'🦷', label:'طب الأسنان',        color:'rgba(16,185,129,.15)' },
  { icon:'👁️', label:'طب العيون',         color:'rgba(245,158,11,.15)' },
  { icon:'🫁', label:'أمراض الصدر',       color:'rgba(239,68,68,.15)'  },
  { icon:'🧬', label:'علم الجينات',       color:'rgba(236,72,153,.15)' },
  { icon:'💊', label:'الصيدلة السريرية',  color:'rgba(14,165,233,.15)' },
  { icon:'🩺', label:'طب الطوارئ',        color:'rgba(34,197,94,.15)'  },
]

const features = [
  { I:Stethoscope, t:'محتوى طبي دقيق',     d:'كل دورة مُعدَّة بمعايير علمية صارمة من قِبل متخصصين في مجالاتهم.' },
  { I:ShieldCheck,  t:'شهادات إتمام',       d:'شهادة رقمية تُصدر تلقائياً عند إتمام الدورة بنسبة 100%.' },
  { I:Brain,        t:'اختبارات تفاعلية',   d:'أسئلة MCQ بعد كل درس مع مراجعة فورية ولوحة صدارة.' },
  { I:Activity,     t:'تتبع التقدم',         d:'تابع تقدمك في كل دورة بشكل مرئي ومفصّل.' },
]

export default function Home() {
  return (
    <div style={{background:'var(--bg)',overflowX:'hidden'}}>

      {/* ══ HERO ═══════════════════════════════════ */}
      <section className="hero" style={{padding:'96px 0 80px',textAlign:'center'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div className="eyebrow">
            <Stethoscope size={11}/>منصة تعليم طبي متخصصة
          </div>
          <h1 style={{fontSize:'clamp(32px,5vw,60px)',fontWeight:900,color:'#fff',
            lineHeight:1.08,letterSpacing:'-.03em',marginBottom:20}}>
            تعلّم الطب من
            <br/>
            <span className="g-text">متخصصين حقيقيين</span>
          </h1>
          <p style={{fontSize:17,color:'rgba(255,255,255,.5)',maxWidth:520,
            margin:'0 auto 36px',lineHeight:1.8}}>
            منصة تعليمية طبية تقدم دورات علمية دقيقة في جميع التخصصات الطبية
            بأسلوب تفاعلي واضح.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
              <PlayCircle size={18}/>استكشف الدورات
            </Link>
            <Link href="/auth/register" className="btn btn-outline btn-xl"
              style={{textDecoration:'none',borderColor:'rgba(255,255,255,.2)',color:'rgba(255,255,255,.8)'}}>
              سجّل مجاناً <ArrowLeft size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SPECIALTIES ════════════════════════════ */}
      <section style={{padding:'64px 0',borderTop:'1px solid var(--brd)'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:40}}>
            <div className="eyebrow">التخصصات</div>
            <h2 className="sec-title">كل التخصصات الطبية</h2>
            <p className="sec-sub">دورات متخصصة في جميع المجالات الطبية والصحية</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:12}}>
            {specialties.map((s,i)=>(
              <Link key={i} href="/courses" style={{textDecoration:'none'}}>
                <div className="card" style={{padding:'20px 14px',textAlign:'center',cursor:'pointer',
                  transition:'all .2s',border:'1px solid var(--brd)'}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--brd2)';el.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--brd)';el.style.transform='none'}}>
                  <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--tx2)',lineHeight:1.3}}>{s.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════════ */}
      <section style={{padding:'64px 0',borderTop:'1px solid var(--brd)'}}>
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:40}}>
            <div className="eyebrow">لماذا منصتنا</div>
            <h2 className="sec-title">مبنية للطلاب الطبيين</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18}}>
            {features.map(({I,t,d},i)=>(
              <div key={i} className="card" style={{padding:'28px 24px'}}>
                <div style={{width:44,height:44,borderRadius:11,background:'var(--brand-light)',
                  border:'1px solid var(--brand-mid)',display:'flex',alignItems:'center',
                  justifyContent:'center',marginBottom:16}}>
                  <I size={20} style={{color:'var(--brand-2)'}}/>
                </div>
                <h3 style={{fontSize:15,fontWeight:800,color:'var(--tx1)',marginBottom:8,letterSpacing:'-.01em'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--tx3)',lineHeight:1.7}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════ */}
      <section style={{padding:'64px 0',borderTop:'1px solid var(--brd)'}}>
        <div className="wrap">
          <div className="card" style={{padding:'52px 40px',textAlign:'center',
            background:'linear-gradient(135deg,rgba(14,165,233,.08) 0%,rgba(6,182,212,.05) 100%)',
            border:'1px solid var(--brd2)'}}>
            <div style={{width:56,height:56,borderRadius:14,background:'var(--brand)',
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 20px',boxShadow:'var(--shb)'}}>
              <GraduationCap size={26} style={{color:'#fff'}}/>
            </div>
            <h2 style={{fontSize:'clamp(22px,3.5vw,36px)',fontWeight:900,color:'var(--tx1)',
              marginBottom:12,letterSpacing:'-.02em'}}>ابدأ رحلتك التعليمية الطبية</h2>
            <p style={{fontSize:15,color:'var(--tx3)',marginBottom:28,maxWidth:420,margin:'0 auto 28px',lineHeight:1.75}}>
              سجّل الآن واستكشف الدورات الطبية المتاحة مجاناً ومدفوعة.
            </p>
            <Link href="/auth/register" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
              <GraduationCap size={18}/>إنشاء حساب مجاني
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════ */}
      <footer style={{borderTop:'1px solid var(--brd)',padding:'32px 0'}}>
        <div className="wrap" style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:'var(--brand)',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Stethoscope size={15} style={{color:'#fff'}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:'var(--tx1)'}}>منصة تعلّم الطبية</span>
          </div>
          <div style={{display:'flex',gap:20,fontSize:13,color:'var(--tx3)'}}>
            <Link href="/courses" style={{color:'var(--tx3)'}}>الدورات</Link>
            <Link href="/contact" style={{color:'var(--tx3)'}}>تواصل</Link>
            <Link href="/terms"   style={{color:'var(--tx3)'}}>الشروط</Link>
            <Link href="/privacy" style={{color:'var(--tx3)'}}>الخصوصية</Link>
          </div>
          <span style={{fontSize:12,color:'var(--tx4)'}}>© 2026 منصة تعلّم الطبية</span>
        </div>
      </footer>
    </div>
  )
}
