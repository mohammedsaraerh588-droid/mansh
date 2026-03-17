'use client'
import Link from 'next/link'
import { BookOpen, Star, Users, Trophy, Rocket, ShieldCheck, PlayCircle,
         Zap, Globe, GraduationCap, CheckCircle, ArrowLeft,
         Clock, Award, TrendingUp, Target } from 'lucide-react'

const stats = [
  { v:'+10,000', l:'طالب مسجّل',   I:Users    },
  { v:'+500',    l:'دورة متاحة',    I:BookOpen },
  { v:'4.9',     l:'تقييم المنصة', I:Star     },
  { v:'+100',    l:'معلم خبير',    I:Trophy   },
]
const features = [
  { I:PlayCircle,  t:'محتوى فيديو احترافي',   d:'دروس مصوّرة بجودة عالية مع إمكانية المشاهدة في أي وقت ومن أي جهاز.' },
  { I:ShieldCheck, t:'شهادات معتمدة دولياً',   d:'شهادات رقمية قابلة للتحقق أضفها لملفك على LinkedIn فوراً.' },
  { I:Target,      t:'اختبارات وتقييم ذكي',    d:'قيّم مستواك الحقيقي بشكل مستمر مع تغذية راجعة فورية.' },
  { I:Globe,       t:'وصول مدى الحياة',        d:'ادفع مرة واحدة وتملّك الدورة للأبد بلا قيود زمنية.' },
  { I:Trophy,      t:'أفضل المعلمين العرب',     d:'كل دورة يُقدّمها خبير في مجاله بسنوات تجربة حقيقية.' },
  { I:TrendingUp,  t:'محتوى محدَّث باستمرار',   d:'نواكب أحدث التطورات في كل مجال لتبقى دائماً في الصدارة.' },
]
const steps = [
  { n:1, t:'أنشئ حسابك',       d:'سجّل مجاناً في ثوانٍ بدون بطاقة ائتمان.' },
  { n:2, t:'اختر دورتك',       d:'تصفّح مئات الدورات في مختلف التخصصات وابدأ التعلم فوراً.' },
  { n:3, t:'احصل على شهادتك',  d:'أنهِ الدورة واحصل على شهادة معتمدة تفتح أمامك فرصاً جديدة.' },
]
const testimonials = [
  { name:'أحمد الزهراني', role:'مطوّر ويب',     text:'حصلت على عملي الحالي بعد إتمام دورات منصة تعلّم. المحتوى احترافي والمعلمون من الأفضل.', stars:5 },
  { name:'سارة العمري',   role:'مصممة UX',       text:'المنصة سهلة الاستخدام والمحتوى بالعربي وبجودة عالمية. أفضل استثمار في مسيرتي المهنية.', stars:5 },
  { name:'خالد المطيري',  role:'مهندس برمجيات',  text:'شهادات منصة تعلّم ساعدتني في الحصول على ترقية. أنصح بها كل من يريد التطور المهني.', stars:5 },
]
const categories = [
  { name:'البرمجة والتطوير', count:120, icon:'' },
  { name:'التصميم الجرافيكي', count:85, icon:'' },
  { name:'التسويق الرقمي', count:64, icon:'' },
  { name:'ريادة الأعمال', count:48, icon:'' },
  { name:'الذكاء الاصطناعي', count:37, icon:'' },
  { name:'اللغات', count:92, icon:'' },
]

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>

    {/*  HERO  */}
    <section className="hero" style={{minHeight:'92vh',display:'flex',alignItems:'center',paddingTop:76}}>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(37,99,235,.18),transparent 70%)',top:'-5%',right:'-5%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,.1),transparent 70%)',bottom:'0',left:'-5%',pointerEvents:'none'}}/>
      <div className="wrap" style={{position:'relative',zIndex:1,width:'100%',padding:'72px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
          {/* Left */}
          <div>
            <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:99,background:'rgba(59,130,246,.12)',border:'1px solid rgba(59,130,246,.25)',marginBottom:24}}>
              <Star size={12} style={{fill:'#fbbf24',color:'#fbbf24'}}/>
              <span style={{fontSize:12,fontWeight:700,color:'#93c5fd',letterSpacing:'.04em'}}>المنصة التعليمية العربية الأولى · 4.9</span>
            </div>
            <h1 className="fade-up" style={{fontSize:'clamp(36px,4.5vw,64px)',fontWeight:900,color:'#fff',lineHeight:1.06,marginBottom:20,letterSpacing:'-.02em',animationDelay:'.08s'}}>
              تعلّم بدون حدود.<br/>
              <span style={{color:'#60a5fa'}}>احترف بثقة.</span>
            </h1>
            <p className="fade-up" style={{fontSize:17,color:'rgba(255,255,255,.6)',maxWidth:460,marginBottom:32,lineHeight:1.85,animationDelay:'.16s'}}>
              دورات تدريبية احترافية يُقدّمها خبراء معتمدون  مع شهادات رقمية تُثبت كفاءتك وتفتح أمامك أبواباً مهنية جديدة.
            </p>
            <div className="fade-up" style={{display:'flex',gap:12,flexWrap:'wrap',animationDelay:'.22s'}}>
              <Link href="/courses" className="btn btn-primary btn-xl" style={{textDecoration:'none'}}>
                <Rocket size={17}/>ابدأ التعلم مجاناً
              </Link>
              <Link href="/courses" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.8)',border:'1px solid rgba(255,255,255,.15)'}}>
                تصفّح الدورات<ArrowLeft size={15}/>
              </Link>
            </div>
            <div className="fade-up" style={{display:'flex',gap:20,marginTop:28,flexWrap:'wrap',animationDelay:'.28s'}}>
              {['بدون بطاقة ائتمان','إلغاء في أي وقت','دعم عربي متخصص'].map((t,i)=>(
                <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,.38)'}}>
                  <CheckCircle size={13} style={{color:'#60a5fa'}}/>{t}
                </span>
              ))}
            </div>
          </div>
          {/* Right  stats */}
          <div className="fade-up" style={{animationDelay:'.3s'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {stats.map(({v,l,I},i)=>(
                <div key={i} style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:'22px 18px',backdropFilter:'blur(12px)'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:'rgba(37,99,235,.25)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
                    <I size={18} style={{color:'#93c5fd'}}/>
                  </div>
                  <div style={{fontSize:26,fontWeight:900,color:'#fff',lineHeight:1}}>{v}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.45)',marginTop:5}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  CATEGORIES  */}
    <section style={{padding:'80px 0',background:'var(--surface)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36}}>
          <div>
            <div className="eyebrow"> التصنيفات</div>
            <h2 className="sec-title" style={{fontSize:'clamp(22px,3vw,36px)'}}>استكشف مجالك</h2>
          </div>
          <Link href="/courses" className="btn btn-outline btn-md" style={{textDecoration:'none'}}>عرض الكل<ArrowLeft size={14}/></Link>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
          {categories.map(({name,count,icon},i)=>(
            <Link key={i} href="/courses" style={{textDecoration:'none'}}>
              <div className="card card-hover" style={{padding:'20px 16px',textAlign:'center',cursor:'pointer'}}>
                <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:'var(--txt1)',marginBottom:4}}>{name}</div>
                <div style={{fontSize:12,color:'var(--txt3)'}}>{count} دورة</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/*  FEATURES  */}
    <section style={{padding:'96px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow"> لماذا نحن</div>
          <h2 className="sec-title">كل ما تحتاجه في مكان واحد</h2>
          <p className="sec-sub">صمّمنا كل تفصيلة لتمنحك أفضل تجربة تعليمية عربية على الإطلاق.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',gap:18}}>
          {features.map(({I,t,d},i)=>(
            <div key={i} className="card card-hover" style={{padding:'26px 22px',display:'flex',gap:16,alignItems:'flex-start'}}>
              <div style={{width:46,height:46,borderRadius:12,background:'var(--blue-soft)',border:'1px solid var(--blue-mid)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <I size={20} style={{color:'var(--blue)'}}/>
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

    {/*  STEPS  */}
    <section style={{padding:'96px 0',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow"> البداية سهلة</div>
          <h2 className="sec-title">ثلاث خطوات فقط</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:40,maxWidth:860,margin:'0 auto',position:'relative'}}>
          <div style={{position:'absolute',top:36,right:'16.5%',left:'16.5%',height:1,background:`linear-gradient(90deg,var(--border),var(--blue2),var(--border))`,display:'none'}}/>
          {steps.map(({n,t,d},i)=>(
            <div key={i} style={{textAlign:'center'}}>
              <div style={{width:62,height:62,borderRadius:16,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'var(--sb)'}}>
                {String(n).padStart(2,'0')}
              </div>
              <h3 style={{fontWeight:800,fontSize:16,marginBottom:8,color:'var(--txt1)'}}>{t}</h3>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.7}}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/*  TESTIMONIALS  */}
    <section style={{padding:'96px 0',background:'var(--bg)'}}>
      <div className="wrap">
        <div style={{textAlign:'center',marginBottom:60}}>
          <div className="eyebrow"> آراء الطلاب</div>
          <h2 className="sec-title">ماذا يقول طلابنا</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
          {testimonials.map(({name,role,text,stars},i)=>(
            <div key={i} className="card" style={{padding:'26px 22px'}}>
              <div style={{display:'flex',gap:2,marginBottom:14}}>
                {Array(stars).fill(0).map((_,j)=><Star key={j} size={14} style={{fill:'#f59e0b',color:'#f59e0b'}}/>)}
              </div>
              <p style={{fontSize:14,color:'var(--txt2)',lineHeight:1.8,marginBottom:18}}>"{text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'#fff',flexShrink:0}}>{name[0]}</div>
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

    {/*  CTA  */}
    <section className="hero" style={{padding:'96px 0'}}>
      <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(37,99,235,.2),transparent 70%)',top:'-20%',right:'15%',pointerEvents:'none'}}/>
      <div className="wrap-sm" style={{textAlign:'center',position:'relative',zIndex:1}}>
        <div className="eyebrow" style={{background:'rgba(59,130,246,.15)',borderColor:'rgba(59,130,246,.3)',color:'#93c5fd'}}> ابدأ اليوم</div>
        <h2 style={{fontSize:'clamp(28px,4.5vw,52px)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:16}}>
          رحلتك المهنية<br/>تبدأ بخطوة واحدة
        </h2>
        <p style={{color:'rgba(255,255,255,.52)',fontSize:16,margin:'0 auto 36px',lineHeight:1.85}}>
          أكثر من 10,000 طالب عربي يتعلمون ويتطورون معنا يومياً.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:28}}>
          <Link href="/auth/register" className="btn btn-white btn-xl" style={{textDecoration:'none'}}>
            <GraduationCap size={18}/>ابدأ مجاناً الآن
          </Link>
          <Link href="/courses" className="btn btn-lg" style={{textDecoration:'none',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.78)',border:'1px solid rgba(255,255,255,.15)'}}>
            تصفّح الدورات<ArrowLeft size={15}/>
          </Link>
        </div>
        <div style={{display:'flex',gap:22,justifyContent:'center',flexWrap:'wrap'}}>
          {['تسجيل مجاني','شهادات معتمدة','دعم 24/7'].map((t,i)=>(
            <span key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,.38)'}}>
              <CheckCircle size={13} style={{color:'#60a5fa'}}/>{t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/*  FOOTER  */}
    <footer style={{background:'#060d1a',padding:'48px 20px 28px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      <div className="wrap">
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:40}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:10,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff',fontSize:16}}>م</div>
              <span style={{fontWeight:900,fontSize:17,color:'#fff'}}>منصة تعلّم</span>
            </div>
            <p style={{fontSize:13.5,color:'rgba(255,255,255,.35)',lineHeight:1.75,maxWidth:260}}>منصة التعليم العربية الأولى  دورات احترافية وشهادات معتمدة لبناء مستقبلك المهني.</p>
          </div>
          {[
            { title:'المنصة',    links:[['/','الرئيسية'],['/courses','الدورات'],['/auth/register','سجّل مجاناً']] },
            { title:'المعلومات', links:[['/terms','الشروط والأحكام'],['/privacy','سياسة الخصوصية'],['/contact','تواصل معنا']] },
            { title:'الدعم',     links:[['/contact','مركز المساعدة'],['/auth/login','تسجيل الدخول']] },
          ].map(({title,links},i)=>(
            <div key={i}>
              <h4 style={{fontWeight:700,fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:14,letterSpacing:'.06em',textTransform:'uppercase'}}>{title}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {links.map(([h,l])=>(
                  <Link key={h as string} href={h as string} style={{fontSize:13.5,color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .2s'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.75)')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.35)')}>{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
          <p style={{fontSize:12.5,color:'rgba(255,255,255,.22)'}}>© {new Date().getFullYear()} منصة تعلّم  جميع الحقوق محفوظة</p>
          <p style={{fontSize:12.5,color:'rgba(255,255,255,.18)'}}>صُنع بـ  للعالم العربي</p>
        </div>
      </div>
    </footer>
    </div>
  )
}
