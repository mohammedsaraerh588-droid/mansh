'use client'
import Link from 'next/link'
import { BookOpen, CheckCircle, ArrowLeft, Stethoscope, GraduationCap,
         ShieldCheck, Activity, Brain, PlayCircle, Users } from 'lucide-react'

const features = [
  { I:Stethoscope, t:'محتوى طبي متخصص',      d:'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح وسهل الفهم.' },
  { I:ShieldCheck,  t:'شهادات إتمام',          d:'احصل على شهادة إتمام رقمية عند إنهاء كل دورة بنجاح.' },
  { I:Brain,        t:'اختبارات تفاعلية',       d:'اختبر معلوماتك بعد كل وحدة عبر أسئلة تفاعلية مع تغذية راجعة فورية.' },
  { I:Activity,     t:'حالات سريرية',          d:'تعلّم من خلال حالات سريرية واقعية تساعدك على ربط النظرية بالتطبيق.' },
  { I:BookOpen,     t:'محتوى نصي وفيديو',      d:'دروس مدعومة بشروحات نصية ومقاطع فيديو لتناسب أسلوب تعلّمك.' },
  { I:Users,        t:'مجتمع طلابي',           d:'تواصل مع زملائك وتبادل المعرفة في بيئة تعليمية تعاونية.' },
]

const steps = [
  { n:1, t:'أنشئ حسابك',      d:'سجّل مجاناً في ثوانٍ وابدأ باستكشاف الدورات المتاحة.' },
  { n:2, t:'اختر دورتك',      d:'تصفّح الدورات المتاحة في مختلف التخصصات وابدأ التعلم فوراً.' },
  { n:3, t:'احصل على شهادتك', d:'أنهِ الدورة بنجاح واحصل على شهادة إتمام رقمية.' },
]

export default function Home() {
  return (
    <div style={{background:'var(--bg)'}}>

    {/* ══ HERO ══════════════════════════════ */}
    <section className="hero" style={{minHeight:'88vh',display:'flex',alignItems:'center',paddingTop:76}}>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,.16),transparent 70%)',top:'-8%',right:'-6%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(20,184,166,.08),transparent 70%)',bottom:'-5%',left:'-4%',pointerEvents:'none'}}/>

      <div className="wrap" style={{position:'relative',zIndex:1,width:'100%',padding:'80px 20px'}}>
        <div style={{maxWidth:680,margin:'0 auto',textAlign:'center'}}>

          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:99,background:'rgba(20,184,166,.12)',border:'1px solid rgba(20,184,166,.28)',marginBottom:24}}>
            <Stethoscope size={13} style={{color:'#5eead4'}}/>
            <span style={{fontSize:12,fontWeight:700,color:'#99f6e4',letterSpacing:'.04em'}}>منصة التعليم الطبي العربي</span>
          </div>

          <h1 className="fade-up" style={{fontSize:'clamp(34px,5vw,64px)',fontWeight:900,color:'#fff',lineHeight:1.07,marginBottom:18,letterSpacing:'-.02em',animationDelay:'.08s'}}>
            تعلّم الطب.<br/>
            <span style={{color:'#2dd4bf'}}>بأسلوب مختلف.</span>
          </h1>

          <p className="fade-up" style={{fontSize:17,color:'rgba(255,255,255,.58)',maxWidth:500,margin:'0 auto 32px',lineHeight:1.85,animationDelay:'.16s'}}>
            منصة تعليمية طبية متخصصة تقدّم دورات في مختلف التخصصات الطبية لطلاب الطب والمتخصصين الصحيين — بمحتوى علمي دقيق وأسلوب واضح.
          </p>

          <div className="fade-up" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animationDelay:'.22s'}}>
            <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
              <PlayCircle size={17}/>استعرض الدورات
            </Link>
            <Link href="/auth/register" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.8)',border:'1px solid rgba(255,255,255,.18)'}}>
              سجّل مجاناً<ArrowLeft size={15}/>
            </Link>
          </div>

          <div className="fade-up" style={{display:'flex',gap:18,marginTop:28,justifyContent:'center',flexWrap:'wrap',animationDelay:'.28s'}}>
            {['تسجيل مجاني','شهادات إتمام رقمية','محتوى علمي محدَّث'].map((t,i)=>(
              <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,.38)'}}>
                <CheckCircle size={13} style={{color:'#2dd4bf'}}/>{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ══ FEATURES ══════════════════════════ */}
    <section style={{padding:'96px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:58}}>
          <div className="eyebrow">⭐ ما تجده في المنصة</div>
          <h2 className="sec-title">تعليم طبي بمنهج واضح</h2>
          <p className="sec-sub">صمّمنا المنصة لتمنح طالب الطب والمتخصص الصحي تجربة تعليمية متكاملة وفعّالة.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',gap:18}}>
          {features.map(({I,t,d},i)=>(
            <div key={i} className="card card-hover" style={{padding:'26px 22px',display:'flex',gap:16,alignItems:'flex-start'}}>
              <div style={{width:46,height:46,borderRadius:12,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <I size={20} style={{color:'var(--teal)'}}/>
              </div>
              <div>
                <h3 style={{fontWeight:800,fontSize:15,marginBottom:6,color:'var(--txt1)'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ STEPS ══════════════════════════════ */}
    <section style={{padding:'96px 0',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:58}}>
          <div className="eyebrow">🎯 ابدأ رحلتك</div>
          <h2 className="sec-title">ثلاث خطوات فقط</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:40,maxWidth:860,margin:'0 auto'}}>
          {steps.map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{width:60,height:60,borderRadius:16,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'var(--st)'}}>
                {String(n).padStart(2,'0')}
              </div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ CTA ════════════════════════════════ */}
    <section className="hero" style={{padding:'96px 0',position:'relative'}}>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,.16),transparent 70%)',top:'10%',right:'12%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="eyebrow" style={{background:'rgba(20,184,166,.15)',borderColor:'rgba(20,184,166,.3)',color:'#99f6e4'}}>🩺 انضم إلى المنصة</div>
        <h2 style={{fontSize:'clamp(26px,4.5vw,50px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:14}}>
          ابدأ التعلم الطبي<br/>الآن مجاناً
        </h2>
        <p style={{color:'rgba(255,255,255,.5)',fontSize:16,margin:'0 auto 34px',lineHeight:1.85}}>
          سجّل حسابك مجاناً واستكشف الدورات الطبية المتاحة — بدون أي التزامات.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:26}}>
          <Link href="/auth/register" className="btn btn-white btn-xl" style={{textDecoration:'none'}}>
            <GraduationCap size={17}/>سجّل مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.78)',border:'1px solid rgba(255,255,255,.18)'}}>
            استعرض الدورات<ArrowLeft size={15}/>
          </Link>
        </div>
        <div style={{display:'flex',gap:22,justifyContent:'center',flexWrap:'wrap'}}>
          {['تسجيل مجاني بالكامل','شهادات إتمام رقمية','محتوى علمي موثوق'].map((t,i)=>(
            <span key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,.36)'}}>
              <CheckCircle size={13} style={{color:'#2dd4bf'}}/>{t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* ══ FOOTER ═════════════════════════════ */}
    <footer style={{background:'#021a1e',padding:'48px 20px 28px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:40,marginBottom:40}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
                <Stethoscope size={18}/>
              </div>
              <span style={{fontWeight:900,fontSize:17,color:'#fff'}}>منصة تعلّم <span style={{color:'#2dd4bf'}}>الطبية</span></span>
            </div>
            <p style={{fontSize:13.5,color:'rgba(255,255,255,.32)',lineHeight:1.75,maxWidth:280}}>
              منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين — محتوى علمي واضح ودقيق.
            </p>
          </div>
          {[
            { title:'المنصة',    links:[['/', 'الرئيسية'],['/courses','الدورات'],['/auth/register','سجّل مجاناً'],['/auth/login','تسجيل الدخول']] },
            { title:'المعلومات', links:[['/terms','الشروط والأحكام'],['/privacy','سياسة الخصوصية'],['/contact','تواصل معنا']] },
          ].map(({title,links},i)=>(
            <div key={i}>
              <h4 style={{fontWeight:700,fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:14,letterSpacing:'.07em',textTransform:'uppercase'}}>{title}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {links.map(([h,l])=>(
                  <Link key={h} href={h} style={{fontSize:13.5,color:'rgba(255,255,255,.32)',textDecoration:'none',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.75)')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.32)')}>{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <p style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© {new Date().getFullYear()} منصة تعلّم الطبية — جميع الحقوق محفوظة</p>
          <p style={{fontSize:12,color:'rgba(255,255,255,.15)'}}>صُنع بـ ❤️ لخدمة الطب العربي</p>
        </div>
      </div>
    </footer>
    </div>
  )
}
