'use client'
import Link from 'next/link'
import { BookOpen, Star, Users, Award, CheckCircle, ArrowLeft,
         Heart, Stethoscope, Brain, Microscope, Pill, Activity,
         GraduationCap, ShieldCheck, Clock, TrendingUp, PlayCircle } from 'lucide-react'

const stats = [
  { v:'+8,000',  l:'طالب طبي',      I:Users     },
  { v:'+400',    l:'دورة متخصصة',   I:BookOpen  },
  { v:'4.9',     l:'تقييم المنصة',  I:Star      },
  { v:'+80',     l:'طبيب محاضر',    I:Stethoscope },
]
const specialties = [
  { icon:'🫀', name:'أمراض القلب والأوعية',  count:48 },
  { icon:'🧠', name:'طب الأعصاب',           count:36 },
  { icon:'🔬', name:'الباثولوجيا والمختبر',  count:42 },
  { icon:'💊', name:'الصيدلة السريرية',      count:55 },
  { icon:'🦴', name:'الجراحة العظمية',       count:31 },
  { icon:'👁️', name:'طب العيون',            count:28 },
  { icon:'🫁', name:'أمراض الجهاز التنفسي', count:39 },
  { icon:'🧬', name:'الوراثة الطبية',        count:22 },
]
const features = [
  { I:Stethoscope, t:'محتوى طبي معتمد',   d:'دورات يُقدّمها أطباء متخصصون ومعتمدون بخبرات سريرية حقيقية.' },
  { I:ShieldCheck,  t:'شهادات CME معتمدة', d:'احصل على ساعات تعليمية طبية مستمرة CME معتمدة دولياً.' },
  { I:Microscope,   t:'محتوى علمي دقيق',   d:'مراجع علمية محدّثة تواكب أحدث الإرشادات والأبحاث الطبية.' },
  { I:Activity,     t:'حالات سريرية تفاعلية', d:'تعلّم عبر حالات حقيقية وتمارين تشخيصية مع تغذية راجعة فورية.' },
  { I:Brain,        t:'اختبارات وأسئلة البورد', d:'تحضير شامل لاختبارات البورد والامتحانات التخصصية العربية والدولية.' },
  { I:TrendingUp,   t:'محتوى محدَّث باستمرار', d:'نواكب آخر المستجدات الطبية والمبادئ التوجيهية العالمية.' },
]
const testimonials = [
  { name:'د. أحمد العمر',   role:'طبيب باطني',        text:'المنصة غيّرت طريقة مذاكرتي للبورد. الأسئلة التفاعلية والحالات السريرية لا مثيل لها.', stars:5 },
  { name:'د. سارة الحربي',  role:'طالبة دراسات عليا', text:'محتوى طبي بالعربي وبجودة عالمية. وفّرت وقتاً كبيراً في البحث عن مراجع موثوقة.', stars:5 },
  { name:'د. خالد النصار',  role:'طبيب أسرة',         text:'الشهادات المعتمدة CME وفّرت عليّ الكثير. كل الدورات التي أحتاجها في مكان واحد.', stars:5 },
]

export default function Home() {
  return (
    <div style={{background:'var(--bg)'}}>

    {/* ══ HERO ══════════════════════════════ */}
    <section className="hero" style={{minHeight:'90vh',display:'flex',alignItems:'center',paddingTop:76}}>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,.18),transparent 70%)',top:'-8%',right:'-6%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(20,184,166,.1),transparent 70%)',bottom:'-5%',left:'-4%',pointerEvents:'none'}}/>

      <div className="wrap" style={{position:'relative',zIndex:1,width:'100%',padding:'72px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center'}}>

          {/* Left */}
          <div>
            <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:99,background:'rgba(20,184,166,.12)',border:'1px solid rgba(20,184,166,.28)',marginBottom:22}}>
              <Heart size={12} style={{fill:'#5eead4',color:'#5eead4'}}/>
              <span style={{fontSize:12,fontWeight:700,color:'#99f6e4',letterSpacing:'.04em'}}>المنصة الطبية التعليمية العربية الأولى</span>
            </div>

            <h1 className="fade-up" style={{fontSize:'clamp(34px,4.5vw,62px)',fontWeight:900,color:'#fff',lineHeight:1.07,marginBottom:18,letterSpacing:'-.02em',animationDelay:'.08s'}}>
              ارتقِ بمعرفتك<br/>
              <span style={{color:'#2dd4bf'}}>الطبية.</span>
            </h1>

            <p className="fade-up" style={{fontSize:16.5,color:'rgba(255,255,255,.58)',maxWidth:460,marginBottom:30,lineHeight:1.85,animationDelay:'.16s'}}>
              دورات طبية متخصصة يُقدّمها أطباء معتمدون — مع شهادات CME تُعتمد في التدريب المهني المستمر لكل الأطباء والمتخصصين الصحيين.
            </p>

            <div className="fade-up" style={{display:'flex',gap:12,flexWrap:'wrap',animationDelay:'.22s'}}>
              <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
                <Stethoscope size={17}/>ابدأ التعلم الطبي
              </Link>
              <Link href="/auth/register" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.8)',border:'1px solid rgba(255,255,255,.18)'}}>
                سجّل مجاناً<ArrowLeft size={15}/>
              </Link>
            </div>

            <div className="fade-up" style={{display:'flex',gap:18,marginTop:26,flexWrap:'wrap',animationDelay:'.28s'}}>
              {['شهادات CME معتمدة','محتوى علمي محدَّث','أطباء متخصصون'].map((t,i)=>(
                <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,.38)'}}>
                  <CheckCircle size={13} style={{color:'#2dd4bf'}}/>{t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — stats */}
          <div className="fade-up" style={{animationDelay:'.3s'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {stats.map(({v,l,I},i)=>(
                <div key={i} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:'22px 18px',backdropFilter:'blur(10px)'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:'rgba(13,148,136,.25)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
                    <I size={18} style={{color:'#5eead4'}}/>
                  </div>
                  <div style={{fontSize:26,fontWeight:900,color:'#fff',lineHeight:1}}>{v}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.42)',marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
            {/* trust badge */}
            <div style={{marginTop:16,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,backdropFilter:'blur(10px)'}}>
              <div style={{width:36,height:36,borderRadius:10,background:'rgba(13,148,136,.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <ShieldCheck size={18} style={{color:'#5eead4'}}/>
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#fff'}}>شهادات CME معتمدة دولياً</div>
                <div style={{fontSize:11.5,color:'rgba(255,255,255,.42)',marginTop:2}}>معتمدة لدى المجالس الطبية العربية والدولية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══ SPECIALTIES ════════════════════════ */}
    <section style={{padding:'80px 0',background:'var(--surface)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:34}}>
          <div>
            <div className="eyebrow">🩺 التخصصات الطبية</div>
            <h2 className="sec-title" style={{fontSize:'clamp(22px,3vw,34px)'}}>استكشف تخصصك الطبي</h2>
          </div>
          <Link href="/courses" className="btn btn-outline btn-md" style={{textDecoration:'none'}}>كل التخصصات<ArrowLeft size={14}/></Link>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {specialties.map(({icon,name,count},i)=>(
            <Link key={i} href="/courses" style={{textDecoration:'none'}}>
              <div className="card card-hover" style={{padding:'18px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                <div style={{width:42,height:42,borderRadius:10,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13.5,color:'var(--txt1)',lineHeight:1.3}}>{name}</div>
                  <div style={{fontSize:12,color:'var(--txt3)',marginTop:3}}>{count} دورة</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ══ FEATURES ════════════════════════════ */}
    <section style={{padding:'96px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:58}}>
          <div className="eyebrow">⭐ لماذا تختار منصتنا</div>
          <h2 className="sec-title">تعليم طبي بمعايير دولية</h2>
          <p className="sec-sub">صمّمنا كل تفصيلة لتمنح الطبيب وطالب الطب أفضل تجربة تعليمية طبية عربية.</p>
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

    {/* ══ HOW IT WORKS ═══════════════════════ */}
    <section style={{padding:'96px 0',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:58}}>
          <div className="eyebrow">🎯 ابدأ رحلتك</div>
          <h2 className="sec-title">ثلاث خطوات للتميز الطبي</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:40,maxWidth:860,margin:'0 auto'}}>
          {[
            { n:1, t:'سجّل حسابك مجاناً',    d:'أنشئ حسابك في ثوانٍ وابدأ باستكشاف التخصصات الطبية المتاحة.' },
            { n:2, t:'اختر دورتك الطبية',    d:'تصفّح مئات الدورات في مختلف التخصصات وابدأ التعلم فوراً.' },
            { n:3, t:'احصل على شهادة CME',   d:'أنهِ الدورة واحصل على شهادة CME معتمدة لسجلك المهني.' },
          ].map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{width:60,height:60,borderRadius:16,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'var(--st)'}}>{String(n).padStart(2,'0')}</div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ═══════════════════════ */}
    <section style={{padding:'96px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:58}}>
          <div className="eyebrow">💬 آراء الأطباء</div>
          <h2 className="sec-title">ماذا يقول أطباؤنا</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
          {testimonials.map(({name,role,text,stars},i)=>(
            <div key={i} className="card" style={{padding:'26px 22px',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,var(--teal),var(--teal2))'}}/>
              <div style={{display:'flex',gap:2,marginBottom:12}}>
                {Array(stars).fill(0).map((_,j)=><Star key={j} size={13} style={{fill:'#f59e0b',color:'#f59e0b'}}/>)}
              </div>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.8,marginBottom:18}}>"{text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,color:'#fff',flexShrink:0}}>{name[2]}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>{name}</div>
                  <div style={{fontSize:12,color:'var(--txt3)'}}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ CTA ════════════════════════════════ */}
    <section className="hero" style={{padding:'96px 0',position:'relative'}}>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,.18),transparent 70%)',top:'10%',right:'12%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="eyebrow" style={{background:'rgba(20,184,166,.15)',borderColor:'rgba(20,184,166,.3)',color:'#99f6e4'}}>🩺 انضم للمجتمع الطبي</div>
        <h2 style={{fontSize:'clamp(26px,4.5vw,50px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:14}}>
          طوّر مسيرتك الطبية<br/>ابدأ اليوم
        </h2>
        <p style={{color:'rgba(255,255,255,.5)',fontSize:15.5,margin:'0 auto 34px',lineHeight:1.85}}>
          أكثر من 8,000 طبيب ومتخصص صحي يتعلمون معنا — انضم إلى المجتمع الطبي العربي.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:26}}>
          <Link href="/auth/register" className="btn btn-white btn-xl" style={{textDecoration:'none'}}>
            <GraduationCap size={17}/>ابدأ مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.78)',border:'1px solid rgba(255,255,255,.18)'}}>
            استعرض الدورات<ArrowLeft size={15}/>
          </Link>
        </div>
        <div style={{display:'flex',gap:22,justifyContent:'center',flexWrap:'wrap'}}>
          {['تسجيل مجاني','شهادات CME معتمدة','دعم طبي متخصص'].map((t,i)=>(
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
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:40}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff',fontSize:16}}>
                <Stethoscope size={18}/>
              </div>
              <span style={{fontWeight:900,fontSize:17,color:'#fff'}}>منصة تعلّم <span style={{color:'#2dd4bf'}}>الطبية</span></span>
            </div>
            <p style={{fontSize:13.5,color:'rgba(255,255,255,.32)',lineHeight:1.75,maxWidth:260}}>منصة التعليم الطبي العربي المتخصص — دورات سريرية وشهادات CME لبناء مسيرتك الطبية.</p>
          </div>
          {[
            { title:'المنصة',     links:[['/', 'الرئيسية'],['/courses','الدورات'],['/auth/register','سجّل مجاناً']] },
            { title:'التخصصات',  links:[['/courses','أمراض القلب'],['/courses','طب الأعصاب'],['/courses','الجراحة']] },
            { title:'الدعم',      links:[['/contact','تواصل معنا'],['/terms','الشروط'],['/privacy','الخصوصية']] },
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
