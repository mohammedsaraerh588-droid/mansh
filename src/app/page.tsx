'use client'
import Link from 'next/link'
import { BookOpen, Star, Users, Award, CheckCircle, ArrowLeft,
         Stethoscope, GraduationCap, ShieldCheck, Clock,
         Activity, Brain, PlayCircle, FlaskConical } from 'lucide-react'

const features = [
  { I:Stethoscope,  t:'محتوى طبي متخصص',     d:'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح.' },
  { I:ShieldCheck,  t:'شهادات إتمام رقمية',    d:'احصل على شهادة إتمام بعد إنهاء كل دورة بنجاح.' },
  { I:Brain,        t:'اختبارات تفاعلية',       d:'اختبر معلوماتك بعد كل وحدة مع تغذية راجعة فورية.' },
  { I:Activity,     t:'حالات سريرية',           d:'تعلّم من خلال حالات واقعية تربط النظرية بالتطبيق.' },
  { I:BookOpen,     t:'محتوى نصي وفيديو',       d:'دروس بشروحات نصية ومقاطع فيديو لتناسب أسلوبك.' },
  { I:Users,        t:'مجتمع طلابي',            d:'تواصل مع زملائك وتبادل المعرفة في بيئة تعاونية.' },
]

const steps = [
  { n:1, t:'أنشئ حسابك',       d:'سجّل مجاناً في ثوانٍ وابدأ باستكشاف الدورات.' },
  { n:2, t:'اختر دورتك',       d:'تصفّح الدورات المتاحة في مختلف التخصصات.' },
  { n:3, t:'احصل على شهادتك',  d:'أنهِ الدورة واحصل على شهادة إتمام رقمية.' },
]

export default function Home() {
  return (
    <div style={{background:'var(--bg)'}}>

    {/*  HERO  */}
    <section className="hero" style={{minHeight:'90vh',display:'flex',alignItems:'center',paddingTop:80}}>
      <div style={{position:'absolute',width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(43,108,176,.14),transparent 70%)',top:'-8%',right:'-6%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(30,73,118,.18),transparent 70%)',bottom:'-4%',left:'-3%',pointerEvents:'none'}}/>
      <div className="wrap" style={{position:'relative',zIndex:1,width:'100%',padding:'80px 20px'}}>
        <div style={{maxWidth:660,margin:'0 auto',textAlign:'center'}}>
          {/* Logo badge */}
          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 18px',borderRadius:99,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',marginBottom:28}}>
            <Stethoscope size={15} style={{color:'#90cdf4'}}/>
            <span style={{fontSize:12,fontWeight:700,color:'#bee3f8',letterSpacing:'.05em'}}>منصة التعليم الطبي العربي</span>
          </div>

          <h1 className="fade-up" style={{fontSize:'clamp(34px,5.5vw,68px)',fontWeight:900,color:'#fff',lineHeight:1.06,marginBottom:18,letterSpacing:'-.02em',animationDelay:'.08s'}}>
            تعلّم الطب.<br/>
            <span style={{color:'#90cdf4'}}>بأسلوب مختلف.</span>
          </h1>

          <p className="fade-up" style={{fontSize:16.5,color:'rgba(255,255,255,.58)',maxWidth:480,margin:'0 auto 32px',lineHeight:1.85,animationDelay:'.16s'}}>
            منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين  محتوى علمي دقيق وشهادات إتمام رقمية.
          </p>

          <div className="fade-up" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animationDelay:'.22s'}}>
            <Link href="/courses" className="btn btn-white btn-xl" style={{textDecoration:'none',fontWeight:800}}>
              <PlayCircle size={17}/>استعرض الدورات
            </Link>
            <Link href="/auth/register" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.85)',border:'1px solid rgba(255,255,255,.2)'}}>
              سجّل مجاناً<ArrowLeft size={15}/>
            </Link>
          </div>

          <div className="fade-up" style={{display:'flex',gap:22,marginTop:32,justifyContent:'center',flexWrap:'wrap',animationDelay:'.3s'}}>
            {['تسجيل مجاني','شهادات إتمام رقمية','محتوى علمي محدَّث'].map((t,i)=>(
              <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,.38)'}}>
                <CheckCircle size={12} style={{color:'#90cdf4'}}/>{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/*  FEATURES  */}
    <section style={{padding:'88px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:56}}>
          <div className="eyebrow"><FlaskConical size={11}/>ما تجده في المنصة</div>
          <h2 className="sec-title">تعليم طبي بمنهج واضح</h2>
          <p className="sec-sub">صمّمنا المنصة لتمنح طالب الطب والمتخصص الصحي تجربة تعليمية متكاملة وفعّالة.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {features.map(({I,t,d},i)=>(
            <div key={i} className="card card-hover" style={{padding:'24px 20px',display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:44,height:44,borderRadius:10,background:'var(--blue-soft)',border:'1px solid var(--blue-mid)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <I size={20} style={{color:'var(--navy)'}}/>
              </div>
              <div>
                <h3 style={{fontWeight:800,fontSize:15,marginBottom:5,color:'var(--txt1)'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/*  STEPS  */}
    <section style={{padding:'88px 0',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:56}}>
          <div className="eyebrow"> ابدأ رحلتك</div>
          <h2 className="sec-title">ثلاث خطوات فقط</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:36,maxWidth:860,margin:'0 auto'}}>
          {steps.map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{width:58,height:58,borderRadius:14,background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:20,fontWeight:900,color:'#fff',boxShadow:'0 4px 14px rgba(13,33,55,.4)'}}>
                {String(n).padStart(2,'0')}
              </div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:7,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/*  CTA  */}
    <section className="hero" style={{padding:'88px 0',position:'relative'}}>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(43,108,176,.16),transparent 70%)',top:'10%',right:'12%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="eyebrow" style={{background:'rgba(144,205,244,.12)',borderColor:'rgba(144,205,244,.25)',color:'#bee3f8'}}> انضم للمنصة</div>
        <h2 style={{fontSize:'clamp(26px,4.5vw,50px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:14}}>
          ابدأ التعلم الطبي<br/>الآن مجاناً
        </h2>
        <p style={{color:'rgba(255,255,255,.52)',fontSize:16,margin:'0 auto 32px',lineHeight:1.85}}>
          سجّل حسابك مجاناً واستكشف الدورات الطبية المتاحة  بدون أي التزامات.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:24}}>
          <Link href="/auth/register" className="btn btn-white btn-xl" style={{textDecoration:'none',fontWeight:800}}>
            <GraduationCap size={17}/>سجّل مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)',border:'1px solid rgba(255,255,255,.2)'}}>
            استعرض الدورات<ArrowLeft size={15}/>
          </Link>
        </div>
      </div>
    </section>

    {/*  FOOTER  */}
    <footer style={{background:'#060f1e',padding:'44px 20px 24px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:36,marginBottom:36}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:9,background:'var(--navy)',border:'2px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
                <Stethoscope size={17}/>
              </div>
              <span style={{fontWeight:900,fontSize:16,color:'#fff'}}>منصة تعلّم <span style={{color:'#90cdf4'}}>الطبية</span></span>
            </div>
            <p style={{fontSize:13.5,color:'rgba(255,255,255,.32)',lineHeight:1.75,maxWidth:260}}>
              منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين.
            </p>
          </div>
          {[
            { title:'المنصة',    links:[['/','الرئيسية'],['/courses','الدورات'],['/auth/register','سجّل مجاناً'],['/auth/login','تسجيل الدخول']] },
            { title:'المعلومات', links:[['/terms','الشروط'],['/privacy','الخصوصية'],['/contact','تواصل معنا']] },
          ].map(({title,links},i)=>(
            <div key={i}>
              <h4 style={{fontWeight:700,fontSize:11,color:'rgba(255,255,255,.45)',marginBottom:14,letterSpacing:'.08em',textTransform:'uppercase'}}>{title}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:9}}>
                {links.map(([h,l])=>(
                  <Link key={h} href={h} style={{fontSize:13.5,color:'rgba(255,255,255,.3)',textDecoration:'none',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.75)')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.3)')}>{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:18,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <p style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© {new Date().getFullYear()} منصة تعلّم الطبية  جميع الحقوق محفوظة</p>
          <p style={{fontSize:12,color:'rgba(255,255,255,.15)'}}>صُنع بـ  لخدمة الطب العربي</p>
        </div>
      </div>
    </footer>
    </div>
  )
}
