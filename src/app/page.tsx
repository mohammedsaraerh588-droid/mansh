'use client'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Star, Users, Trophy, Rocket, ShieldCheck, PlayCircle,
         Zap, Globe, GraduationCap, CheckCircle, ArrowLeft, Sparkles,
         Clock, Award } from 'lucide-react'

/* ─ data ─────────────────────────────────────── */
const stats = [
  { v:'+10,000', l:'طالب مسجّل',  I:Users   },
  { v:'+500',    l:'دورة متاحة',  I:BookOpen},
  { v:'4.9★',    l:'تقييم عام',   I:Star    },
  { v:'+100',    l:'معلم خبير',   I:Trophy  },
]
const features = [
  { I:PlayCircle, t:'فيديو بجودة عالية',    d:'دروس مصوّرة باحترافية تامة مع إمكانية المشاهدة المتكررة في أي وقت.' },
  { I:ShieldCheck,t:'شهادات موثّقة',         d:'شهادات رقمية قابلة للتحقق — أضفها مباشرةً لملفك على LinkedIn.' },
  { I:Zap,        t:'اختبارات ذكية',         d:'تحقق من مستواك عبر اختبارات تفاعلية مع تغذية راجعة فورية.' },
  { I:Globe,      t:'وصول مدى الحياة',       d:'ادفع مرة وتملّك الدورة للأبد — بلا قيود زمنية أو تجديدات.' },
  { I:Trophy,     t:'معلمون متخصصون',        d:'كل دورة يُقدّمها خبير ميداني بسنوات من الخبرة الفعلية.' },
  { I:BookOpen,   t:'محتوى محدَّث باستمرار',  d:'نواكب أحدث التطورات في كل مجال حتى تبقى دائماً في الصدارة.' },
]
const steps = [
  { n:'01', t:'أنشئ حسابك',      d:'سجّل مجاناً في ثوانٍ واختر تخصصك.' },
  { n:'02', t:'اختر دورتك',      d:'تصفّح مئات الدورات وابدأ التعلم فوراً.' },
  { n:'03', t:'احصل على شهادتك', d:'أنهِ الدورة واحصل على شهادة معتمدة تثبت كفاءتك.' },
]
const testimonials = [
  { name:'أحمد الزهراني', role:'مطوّر ويب', text:'غيّرت هذه المنصة مساري المهني تماماً. الدورات احترافية والمعلمون على مستوى عالٍ.', stars:5 },
  { name:'سارة العمري',  role:'مصممة جرافيك', text:'المحتوى بالعربي وبجودة عالمية. أفضل استثمار في تطوير مهاراتي.', stars:5 },
  { name:'خالد المطيري', role:'مهندس برمجيات', text:'الشهادات معتمدة وساعدتني في الحصول على فرصة عمل أفضل.', stars:5 },
]

export default function Home() {
  return (
    <div>
    {/* ══ HERO ══════════════════════════════════════ */}
    <section className="hero-bg" style={{minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:80}}>
      <div className="wrap" style={{paddingTop:80,paddingBottom:80,width:'100%'}}>
        <div style={{maxWidth:700,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          {/* eyebrow */}
          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 18px',borderRadius:99,background:'rgba(160,120,40,.12)',border:'1px solid rgba(160,120,40,.25)',marginBottom:28}}>
            <Sparkles size={13} style={{color:'var(--gold3)'}}/>
            <span style={{fontSize:12,fontWeight:700,color:'var(--gold3)',letterSpacing:'.06em'}}>منصة التعليم العربي الراقية</span>
          </div>

          <h1 className="fade-up" style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,color:'#fff',lineHeight:1.08,marginBottom:20,letterSpacing:'-.02em',animationDelay:'.08s'}}>
            طوّر مهاراتك<br/>
            <span className="g-text">بمستوى احترافي</span>
          </h1>

          <div className="gold-bar fade-up" style={{animationDelay:'.16s'}}/>

          <p className="fade-up" style={{fontSize:17,color:'rgba(255,255,255,.58)',maxWidth:480,margin:'20px auto 36px',lineHeight:1.85,animationDelay:'.22s'}}>
            دورات تدريبية متخصصة يقدّمها خبراء معتمدون — مع شهادات رقمية تُثبت كفاءتك أمام سوق العمل.
          </p>

          <div className="fade-up" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',animationDelay:'.28s'}}>
            <Link href="/courses" className="btn btn-gold btn-xl" style={{textDecoration:'none'}}>
              <Rocket size={18}/> استكشف الدورات
            </Link>
            <Link href="/auth/register" className="btn btn-outline btn-xl" style={{textDecoration:'none',borderColor:'rgba(255,255,255,.22)',color:'rgba(255,255,255,.78)'}}>
              ابدأ مجاناً <ArrowLeft size={16}/>
            </Link>
          </div>

          {/* stats */}
          <div className="fade-up" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',marginTop:68,border:'1px solid rgba(255,255,255,.08)',borderRadius:18,overflow:'hidden',animationDelay:'.38s'}}>
            {stats.map(({v,l,I},i)=>(
              <div key={i} style={{padding:'22px 12px',textAlign:'center',background:'rgba(255,255,255,.03)',borderLeft:i>0?'1px solid rgba(255,255,255,.06)':'none'}}>
                <I size={16} style={{color:'var(--gold3)',margin:'0 auto 8px',display:'block'}}/>
                <div style={{fontSize:22,fontWeight:900,color:'#fff',lineHeight:1}}>{v}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginTop:5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* decorative orb */}
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'rgba(160,120,40,.08)',filter:'blur(80px)',top:'10%',right:'-8%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'rgba(48,48,90,.25)',filter:'blur(60px)',bottom:'5%',left:'-5%',pointerEvents:'none'}}/>
    </section>

    {/* ══ FEATURES ══════════════════════════════════ */}
    <section style={{padding:'100px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:64}}>
          <p className="sec-eyebrow">لماذا تختارنا</p>
          <h2 className="sec-title">كل ما تحتاجه في مكان واحد</h2>
          <div className="gold-bar"/>
          <p className="sec-sub">صمّمنا كل تفصيلة بعناية لتضمن لك أفضل تجربة تعليمية باللغة العربية.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
          {features.map(({I,t,d},i)=>(
            <div key={i} className="card card-hover" style={{padding:'28px 26px'}}>
              <div style={{width:50,height:50,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,background:'linear-gradient(135deg,var(--navy),var(--navy2))',boxShadow:'var(--s2)'}}>
                <I size={21} style={{color:'var(--gold3)'}}/>
              </div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.75}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ STEPS ═════════════════════════════════════ */}
    <section style={{padding:'100px 0',background:'var(--bg2)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:64}}>
          <p className="sec-eyebrow">كيف تبدأ</p>
          <h2 className="sec-title">ثلاث خطوات للاحتراف</h2>
          <div className="gold-bar"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:48,maxWidth:900,margin:'0 auto'}}>
          {steps.map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center',position:'relative'}}>
              {i<steps.length-1 && <div style={{position:'absolute',top:28,left:'-50%',width:'100%',height:1,background:'linear-gradient(90deg,var(--gold2),transparent)',opacity:.3,display:'none'}}/>}
              <div style={{fontSize:72,fontWeight:900,lineHeight:1,background:'linear-gradient(135deg,var(--gold),var(--gold3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',opacity:.22,marginBottom:8}}>{n}</div>
              <div style={{width:44,height:2,background:'linear-gradient(90deg,var(--gold),var(--gold3))',borderRadius:2,margin:'0 auto 16px'}}/>
              <h3 style={{fontWeight:800,fontSize:17,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ══════════════════════════════ */}
    <section style={{padding:'100px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:64}}>
          <p className="sec-eyebrow">آراء طلابنا</p>
          <h2 className="sec-title">ماذا يقولون عنّا</h2>
          <div className="gold-bar"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
          {testimonials.map(({name,role,text,stars},i)=>(
            <div key={i} className="card" style={{padding:'26px 24px'}}>
              <div style={{display:'flex',gap:3,marginBottom:14}}>
                {Array(stars).fill(0).map((_,j)=><Star key={j} size={14} style={{fill:'var(--gold2)',color:'var(--gold2)'}}/>)}
              </div>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.75,marginBottom:18}}>"{text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,var(--navy),var(--navy2))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'var(--gold3)',flexShrink:0}}>{name[0]}</div>
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

    {/* ══ CTA ═══════════════════════════════════════ */}
    <section className="hero-bg" style={{padding:'100px 0',position:'relative'}}>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'rgba(160,120,40,.1)',filter:'blur(70px)',top:'20%',left:'15%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <p className="sec-eyebrow" style={{color:'var(--gold3)'}}>✦ انضم إلى المجتمع ✦</p>
        <h2 style={{fontSize:'clamp(28px,4.5vw,52px)',fontWeight:900,color:'#fff',lineHeight:1.12,marginBottom:14}}>
          رحلتك نحو الاحتراف<br/>تبدأ اليوم
        </h2>
        <div className="gold-bar"/>
        <p style={{color:'rgba(255,255,255,.52)',fontSize:16,margin:'18px auto 36px',lineHeight:1.85}}>
          أكثر من 10,000 طالب عربي يتعلمون معنا كل يوم — كن واحداً منهم.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:28}}>
          <Link href="/auth/register" className="btn btn-gold btn-xl" style={{textDecoration:'none'}}>
            <GraduationCap size={18}/> ابدأ مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-outline btn-xl" style={{textDecoration:'none',borderColor:'rgba(255,255,255,.2)',color:'rgba(255,255,255,.72)'}}>
            تصفّح الدورات <ArrowLeft size={16}/>
          </Link>
        </div>
        <div style={{display:'flex',gap:22,justifyContent:'center',flexWrap:'wrap'}}>
          {['تسجيل مجاني بالكامل','شهادات معتمدة','دعم 24/7'].map((t,i)=>(
            <span key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,.38)'}}>
              <CheckCircle size={13} style={{color:'var(--gold2)'}}/>{t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* ══ FOOTER ════════════════════════════════════ */}
    <footer style={{background:'#08080f',padding:'36px 20px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#a07828,#c49a3c)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff',fontSize:15}}>م</div>
          <span style={{fontWeight:900,fontSize:16,color:'#fff'}}>منصة <span className="g-text">تعلّم</span></span>
        </div>
        <div style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center'}}>
          {[['/', 'الرئيسية'],['/courses','الدورات'],['/terms','الشروط'],['/privacy','الخصوصية'],['/contact','تواصل معنا']].map(([h,l])=>(
            <Link key={h as string} href={h as string} style={{fontSize:13,color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .2s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.7)')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.35)')}>{l}</Link>
          ))}
        </div>
        <p style={{fontSize:12,color:'rgba(255,255,255,.22)'}}>© {new Date().getFullYear()} منصة تعلّم — جميع الحقوق محفوظة</p>
      </div>
    </footer>
    </div>
  )
}
