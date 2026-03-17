'use client'
import Link from 'next/link'
import { BookOpen, Star, Users, Trophy, Rocket, ShieldCheck, PlayCircle,
         Zap, Globe, GraduationCap, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react'

const stats = [
  { v:'+10,000', l:'طالب مسجّل',   I:Users    },
  { v:'+500',    l:'دورة متاحة',    I:BookOpen },
  { v:'4.9★',    l:'تقييم المنصة', I:Star     },
  { v:'+100',    l:'معلم خبير',    I:Trophy   },
]
const features = [
  { I:PlayCircle,  t:'محتوى فيديو احترافي',  d:'دروس مصوّرة بجودة عالية قابلة للمشاهدة في أي وقت من أي جهاز.' },
  { I:ShieldCheck, t:'شهادات موثّقة دولياً',  d:'احصل على شهادة رقمية معتمدة بعد إتمام كل دورة وأضفها لـ LinkedIn.' },
  { I:Zap,         t:'اختبارات تفاعلية',      d:'تقييم مستمر لمستواك مع تغذية راجعة فورية ومفصّلة.' },
  { I:Globe,       t:'وصول مدى الحياة',       d:'ادفع مرة واحدة وتملّك الدورة للأبد بلا قيود زمنية.' },
  { I:Trophy,      t:'أفضل المعلمين العرب',    d:'كل دورة يُقدّمها خبير ميداني بسنوات تجربة حقيقية.' },
  { I:BookOpen,    t:'محتوى محدَّث باستمرار',  d:'نواكب كل تطور في كل تخصص حتى تبقى دائماً في الطليعة.' },
]
const steps = [
  { n:'01', t:'أنشئ حسابك',       d:'سجّل مجاناً في ثوانٍ بدون بطاقة ائتمان.' },
  { n:'02', t:'اختر دورتك',       d:'تصفّح مئات الدورات وابدأ التعلم فوراً.' },
  { n:'03', t:'احصل على شهادتك',  d:'أنهِ الدورة واحصل على شهادة معتمدة تفتح أمامك أبواباً مهنية جديدة.' },
]
const testimonials = [
  { name:'أحمد الزهراني', role:'مطوّر ويب',      text:'غيّرت منصة تعلّم مساري المهني. المحتوى احترافي والمعلمون متميزون.', stars:5 },
  { name:'سارة العمري',   role:'مصممة جرافيك',   text:'أفضل استثمار قمت به في تطوير مهاراتي — عربي وبجودة عالمية.', stars:5 },
  { name:'خالد المطيري',  role:'مهندس برمجيات',  text:'الشهادات ساعدتني في الحصول على وظيفة أحلامي خلال شهرين فقط.', stars:5 },
]

export default function Home() {
  return (
    <div style={{background:'var(--c-bg)'}}>

    {/* ══════════════════════════════ HERO */}
    <section className="hero" style={{minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:80}}>
      <div className="hero-dot-grid"/>
      {/* glow orbs */}
      <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,40,217,.15),transparent 70%)',top:'-10%',right:'-10%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,.1),transparent 70%)',bottom:'0%',left:'-8%',pointerEvents:'none'}}/>

      <div className="wrap" style={{position:'relative',zIndex:1,paddingTop:80,paddingBottom:80,width:'100%'}}>
        <div style={{maxWidth:720,margin:'0 auto',textAlign:'center'}}>

          {/* badge */}
          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:99,background:'rgba(109,40,217,.12)',border:'1px solid rgba(139,92,246,.25)',marginBottom:26}}>
            <Sparkles size={13} style={{color:'#c4b5fd'}}/>
            <span style={{fontSize:12,fontWeight:700,color:'#c4b5fd',letterSpacing:'.05em'}}>منصة التعليم العربي الأولى</span>
          </div>

          <h1 className="fade-up" style={{fontSize:'clamp(38px,6vw,76px)',fontWeight:900,color:'#fff',lineHeight:1.05,marginBottom:22,letterSpacing:'-.025em',animationDelay:'.08s'}}>
            تعلّم. طوّر. <br/><span className="g-text">احترف.</span>
          </h1>

          <p className="fade-up" style={{fontSize:17,color:'rgba(255,255,255,.55)',maxWidth:500,margin:'0 auto 36px',lineHeight:1.85,animationDelay:'.16s'}}>
            دورات تدريبية متخصصة يقدّمها خبراء معتمدون — مع شهادات رقمية تُثبت كفاءتك وتفتح أمامك أبواباً مهنية جديدة.
          </p>

          <div className="fade-up" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animationDelay:'.24s'}}>
            <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
              <Rocket size={18}/>استكشف الدورات
            </Link>
            <Link href="/auth/register" className="btn btn-secondary btn-xl" style={{textDecoration:'none',borderColor:'rgba(255,255,255,.18)',color:'rgba(255,255,255,.8)',background:'rgba(255,255,255,.06)'}}>
              ابدأ مجاناً<ArrowLeft size={16}/>
            </Link>
          </div>

          {/* mini trust */}
          <div className="fade-up" style={{display:'flex',gap:18,justifyContent:'center',marginTop:28,flexWrap:'wrap',animationDelay:'.3s'}}>
            {['بدون بطاقة ائتمان','إلغاء في أي وقت','شهادات معتمدة'].map((t,i)=>(
              <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,.35)'}}>
                <CheckCircle size={12} style={{color:'#a78bfa'}}/>{t}
              </span>
            ))}
          </div>
        </div>

        {/* stats */}
        <div className="fade-up" style={{maxWidth:760,margin:'64px auto 0',display:'grid',gridTemplateColumns:'repeat(4,1fr)',border:'1px solid rgba(255,255,255,.07)',borderRadius:20,overflow:'hidden',background:'rgba(255,255,255,.03)',backdropFilter:'blur(12px)',animationDelay:'.38s'}}>
          {stats.map(({v,l,I},i)=>(
            <div key={i} style={{padding:'24px 12px',textAlign:'center',borderLeft:i>0?'1px solid rgba(255,255,255,.06)':'none'}}>
              <I size={16} style={{color:'#a78bfa',margin:'0 auto 10px',display:'block'}}/>
              <div style={{fontSize:24,fontWeight:900,color:'#fff',lineHeight:1}}>{v}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.36)',marginTop:5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════ FEATURES */}
    <section style={{padding:'100px 0',background:'var(--c-bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow"><Sparkles size={11}/>لماذا تختارنا</div>
          <h2 className="sec-title">كل ما تحتاجه في مكان واحد</h2>
          <p className="sec-sub">صمّمنا كل تفصيلة بعناية لتضمن لك أفضل تجربة تعليمية باللغة العربية.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
          {features.map(({I,t,d},i)=>(
            <div key={i} className="card card-hover" style={{padding:'28px 24px'}}>
              <div className="feat-icon"><I size={22} style={{color:'var(--c-p)'}}/></div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--c-txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--c-txt2)',lineHeight:1.75}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════ STEPS */}
    <section style={{padding:'100px 0',background:'var(--c-bg2)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow">🎯 كيف تبدأ</div>
          <h2 className="sec-title">ثلاث خطوات للاحتراف</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:40,maxWidth:880,margin:'0 auto'}}>
          {steps.map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center',position:'relative'}}>
              <div style={{width:64,height:64,borderRadius:18,background:'linear-gradient(135deg,var(--c-p),var(--c-p3))',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'var(--sp)'}}>
                {n}
              </div>
              <h3 style={{fontWeight:800,fontSize:17,marginBottom:8,color:'var(--c-txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--c-txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════ TESTIMONIALS */}
    <section style={{padding:'100px 0',background:'var(--c-bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow">⭐ آراء طلابنا</div>
          <h2 className="sec-title">ماذا يقولون عنّا</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
          {testimonials.map(({name,role,text,stars},i)=>(
            <div key={i} className="card" style={{padding:'26px 22px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,var(--c-p),var(--c-p3),var(--c-acc))'}}/>
              <div style={{display:'flex',gap:3,marginBottom:12}}>
                {Array(stars).fill(0).map((_,j)=><Star key={j} size={14} style={{fill:'#f59e0b',color:'#f59e0b'}}/>)}
              </div>
              <p style={{fontSize:14,color:'var(--c-txt2)',lineHeight:1.8,marginBottom:18}}>"{text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:14,borderTop:'1px solid var(--c-border)'}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--c-p),var(--c-p3))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'#fff',flexShrink:0}}>{name[0]}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:'var(--c-txt1)'}}>{name}</div>
                  <div style={{fontSize:12,color:'var(--c-txt3)'}}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════ CTA */}
    <section className="hero" style={{padding:'100px 0',position:'relative'}}>
      <div className="hero-dot-grid"/>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,40,217,.15),transparent 70%)',top:'10%',right:'10%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="eyebrow" style={{background:'rgba(139,92,246,.15)',borderColor:'rgba(139,92,246,.3)',color:'#c4b5fd'}}>✦ انضم للمجتمع</div>
        <h2 style={{fontSize:'clamp(28px,5vw,56px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:16}}>
          رحلتك نحو الاحتراف<br/>تبدأ الآن
        </h2>
        <p style={{color:'rgba(255,255,255,.5)',fontSize:16,margin:'0 auto 36px',lineHeight:1.85,maxWidth:480}}>
          أكثر من 10,000 طالب عربي يتعلمون معنا كل يوم — انضم إليهم.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:28}}>
          <Link href="/auth/register" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
            <GraduationCap size={18}/>ابدأ مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-secondary btn-xl" style={{textDecoration:'none',borderColor:'rgba(255,255,255,.18)',color:'rgba(255,255,255,.75)',background:'rgba(255,255,255,.05)'}}>
            تصفّح الدورات<ArrowLeft size={16}/>
          </Link>
        </div>
        <div style={{display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap'}}>
          {['تسجيل مجاني','شهادات معتمدة','دعم 24/7'].map((t,i)=>(
            <span key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,.35)'}}>
              <CheckCircle size={13} style={{color:'#a78bfa'}}/>{t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════ FOOTER */}
    <footer style={{background:'#07070e',padding:'40px 20px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          {/* logo */}
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#6d28d9,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff',fontSize:16}}>م</div>
            <span style={{fontWeight:900,fontSize:17,color:'#fff'}}>منصة <span className="g-text">تعلّم</span></span>
          </div>
          {/* links */}
          <div style={{display:'flex',gap:22,flexWrap:'wrap',justifyContent:'center'}}>
            {[['/', 'الرئيسية'],['/courses','الدورات'],['/terms','الشروط'],['/privacy','الخصوصية'],['/contact','تواصل معنا']].map(([h,l])=>(
              <Link key={h as string} href={h as string} style={{fontSize:13,color:'rgba(255,255,255,.32)',textDecoration:'none',transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.7)')}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.32)')}>{l}</Link>
            ))}
          </div>
          <p style={{fontSize:12,color:'rgba(255,255,255,.2)'}}>© {new Date().getFullYear()} منصة تعلّم — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
    </div>
  )
}
