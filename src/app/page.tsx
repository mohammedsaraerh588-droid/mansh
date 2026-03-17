'use client'
import Link from 'next/link'
import { BookOpen, Star, Users, Trophy, Rocket, ShieldCheck, PlayCircle, Zap, Globe, GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react'

export default function Home() {
  const stats = [
    { v:'+10,000', l:'طالب مسجّل',  Icon:Users  },
    { v:'+500',    l:'دورة متاحة',   Icon:BookOpen },
    { v:'4.9★',    l:'تقييم المنصة', Icon:Star   },
    { v:'+100',    l:'معلم خبير',    Icon:Trophy },
  ]
  const features = [
    { Icon:PlayCircle,  t:'فيديو بجودة عالية',   d:'دروس مصوّرة بدقة فائقة مع إمكانية المشاهدة في أي وقت ومن أي جهاز.' },
    { Icon:ShieldCheck, t:'شهادات موثّقة',        d:'شهادات رقمية معتمدة تضيفها لملفك المهني على LinkedIn.' },
    { Icon:Zap,         t:'اختبارات تفاعلية',     d:'قيّم مستواك باختبارات متدرجة مع تغذية راجعة فورية ومفصّلة.' },
    { Icon:Globe,       t:'وصول مدى الحياة',      d:'تملّك الدورة للأبد — راجع المحتوى متى شئت بدون أي قيود.' },
    { Icon:Trophy,      t:'معلمون متخصصون',       d:'كل دورة بإشراف خبير في مجاله بسنوات من التجربة العملية.' },
    { Icon:BookOpen,    t:'محتوى محدَّث دائماً',   d:'نحرص على مواكبة كل جديد في كل تخصص لتبقى دائماً في الطليعة.' },
  ]
  const steps = [
    { n:'01', t:'أنشئ حسابك',   d:'سجّل مجاناً في أقل من دقيقة واختر مجالك.' },
    { n:'02', t:'اختر دورتك',   d:'تصفّح مئات الدورات وابدأ التعلّم فوراً.' },
    { n:'03', t:'احصل على شهادتك', d:'أنهِ الدورة واحصل على شهادة معتمدة.' },
  ]
  return (
    <div style={{minHeight:'100vh'}}>

      {/* HERO */}
      <section className="hero-wrap" style={{minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:80}}>
        <div className="hero-glow" style={{width:400,height:400,background:'rgba(184,145,42,.15)',top:'-10%',right:'-5%'}}/>
        <div className="hero-glow" style={{width:300,height:300,background:'rgba(99,102,241,.1)',bottom:'10%',left:'5%'}}/>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'80px 24px',textAlign:'center',position:'relative',zIndex:1,width:'100%'}}>
          <p className="sec-eyebrow fade-up" style={{animationDelay:'0s'}}>✦ منصة التعليم العربي الراقية ✦</p>
          <h1 className="fade-up" style={{fontSize:'clamp(38px,6vw,72px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:20,animationDelay:'.1s'}}>
            طوّر مهاراتك<br/><span className="g-text">بمستوى احترافي</span>
          </h1>
          <div className="gold-bar fade-up" style={{animationDelay:'.2s'}}/>
          <p className="fade-up" style={{fontSize:17,color:'rgba(255,255,255,.6)',maxWidth:520,margin:'18px auto 36px',lineHeight:1.8,animationDelay:'.25s'}}>
            دورات تدريبية متخصصة يُقدّمها خبراء معتمدون — مع شهادات رقمية تُثبت كفاءتك أمام سوق العمل.
          </p>
          <div className="fade-up" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',animationDelay:'.3s'}}>
            <Link href="/courses" className="btn btn-gold btn-xl" style={{textDecoration:'none'}}>
              <Rocket size={18}/>استكشف الدورات
            </Link>
            <Link href="/auth/register" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,padding:'16px 36px',borderRadius:12,fontWeight:700,fontSize:15,color:'rgba(255,255,255,.75)',border:'2px solid rgba(255,255,255,.2)',transition:'all .2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.5)';(e.currentTarget as HTMLElement).style.color='#fff'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.2)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.75)'}}>
              إنشاء حساب مجاني<ArrowLeft size={16}/>
            </Link>
          </div>

          {/* Stats grid */}
          <div className="fade-up" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,maxWidth:720,margin:'64px auto 0',border:'1px solid rgba(255,255,255,.1)',borderRadius:16,overflow:'hidden',animationDelay:'.45s'}}>
            {stats.map(({v,l,Icon},i)=>(
              <div key={i} style={{padding:'24px 16px',textAlign:'center',background:'rgba(255,255,255,.04)'}}>
                <Icon size={18} style={{color:'var(--gold)',margin:'0 auto 8px'}}/>
                <div style={{fontSize:22,fontWeight:900,color:'#fff'}}>{v}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:'96px 24px',background:'var(--bg)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <p className="sec-eyebrow">لماذا تختارنا</p>
            <h2 className="sec-title">كل ما تحتاجه في مكان واحد</h2>
            <div className="gold-bar"/>
            <p className="sec-sub">صمّمنا كل تفصيلة لتضمن لك أفضل تجربة تعليمية باللغة العربية.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:22}}>
            {features.map(({Icon,t,d},i)=>(
              <div key={i} className="card card-hover" style={{padding:28}}>
                <div style={{width:52,height:52,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,background:'linear-gradient(135deg,#1c1c2e,#2a2a42)',boxShadow:'var(--shadow2)'}}>
                  <Icon size={22} style={{color:'var(--gold)'}}/>
                </div>
                <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--txt2)',lineHeight:1.75}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section style={{padding:'96px 24px',background:'var(--bg2)'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <p className="sec-eyebrow">كيف تبدأ</p>
            <h2 className="sec-title">ثلاث خطوات للاحتراف</h2>
            <div className="gold-bar"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:36}}>
            {steps.map(({n,t,d},i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <div style={{fontSize:64,fontWeight:900,lineHeight:1,background:'linear-gradient(135deg,#b8912a,#f0c96a)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',opacity:.3,marginBottom:6}}>{n}</div>
                <div style={{width:48,height:2,background:'linear-gradient(90deg,#b8912a,#f0c96a)',borderRadius:2,margin:'0 auto 16px'}}/>
                <h3 style={{fontWeight:800,fontSize:17,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
                <p style={{fontSize:13.5,color:'var(--txt2)'}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-wrap" style={{padding:'96px 24px',position:'relative'}}>
        <div className="hero-glow" style={{width:320,height:320,background:'rgba(184,145,42,.12)',top:'20%',right:'15%'}}/>
        <div style={{maxWidth:680,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <p className="sec-eyebrow" style={{color:'var(--gold)'}}>✦ انضم إلى المجتمع ✦</p>
          <h2 style={{fontSize:'clamp(30px,4.5vw,52px)',fontWeight:900,color:'#fff',lineHeight:1.15,marginBottom:14}}>رحلتك نحو الاحتراف<br/>تبدأ اليوم</h2>
          <div className="gold-bar"/>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:16,margin:'18px auto 36px',lineHeight:1.8}}>أكثر من 10,000 طالب عربي يتعلمون معنا كل يوم — كن واحداً منهم.</p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/auth/register" className="btn btn-gold btn-xl" style={{textDecoration:'none'}}><GraduationCap size={18}/>ابدأ مجاناً الآن</Link>
            <Link href="/courses" style={{textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,padding:'16px 32px',borderRadius:12,fontWeight:700,color:'rgba(255,255,255,.7)',border:'2px solid rgba(255,255,255,.2)',fontSize:15}}>تصفّح الدورات<ArrowLeft size={16}/></Link>
          </div>
          <div style={{display:'flex',gap:24,justifyContent:'center',marginTop:28,flexWrap:'wrap'}}>
            {['تسجيل مجاني','شهادات معتمدة','دعم 24/7'].map((t,i)=>(
              <span key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,.4)'}}>
                <CheckCircle size={13} style={{color:'var(--gold)'}}/>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0a0a14',padding:'36px 24px',textAlign:'center',borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:10}}>
          <div style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,background:'linear-gradient(135deg,#b8912a,#d4a843)',color:'#fff',fontSize:16}}>م</div>
          <span style={{fontWeight:900,fontSize:16,color:'#fff'}}>منصة <span className="g-text">تعلّم</span></span>
        </div>
        <p style={{fontSize:12,color:'rgba(255,255,255,.3)'}}>© {new Date().getFullYear()} منصة تعلّم — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  )
}
