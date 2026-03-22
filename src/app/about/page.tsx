import { Stethoscope, Target, Users, Award, BookOpen, Heart, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

const STATS = [
  { value:'500+',  label:'دورة طبية',         icon:'📚' },
  { value:'50+',   label:'معلم متخصص',        icon:'👨‍⚕️' },
  { value:'10,000+', label:'طالب مسجّل',      icon:'🎓' },
  { value:'95%',   label:'نسبة رضا الطلاب',   icon:'⭐' },
]

const TEAM = [
  { name:'د. محمد السرّاي', role:'المؤسس والمدير التنفيذي', specialty:'طب الأعصاب', avatar:'م' },
  { name:'د. أحمد العلي',   role:'رئيس المحتوى العلمي',    specialty:'طب الباطنية', avatar:'أ' },
  { name:'سارة الحربي',     role:'مديرة تجربة المستخدم',   specialty:'تقنية التعليم', avatar:'س' },
]

const VALUES = [
  { icon:Target,   title:'الدقة العلمية',   desc:'كل محتوى مراجَع من متخصصين معتمدين قبل النشر' },
  { icon:Heart,    title:'الشغف بالتعليم',  desc:'نؤمن أن التعليم الطبي الجيد يُنقذ أرواحاً' },
  { icon:Users,    title:'مجتمع متعاون',    desc:'بيئة تعليمية يدعم فيها الطلاب بعضهم بعضاً' },
  { icon:Award,    title:'الجودة أولاً',    desc:'نختار المعلمين بعناية ونضمن أعلى معايير الجودة' },
]

export default function AboutPage() {
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)', paddingBottom:60}}>

      {/* Hero */}
      <div className="hero" style={{padding:'64px 0 56px', textAlign:'center', position:'relative', overflow:'hidden'}}>
        <div className="wrap" style={{position:'relative', zIndex:1}}>
          <div className="eyebrow"><Stethoscope size={11}/>من نحن</div>
          <h1 style={{fontSize:'clamp(28px,5vw,48px)', fontWeight:900, color:'#fff', letterSpacing:'-.03em', marginBottom:16, lineHeight:1.15}}>
            منصة تعلّم الطبية<br/>
            <span style={{color:'var(--alpha-green-3)'}}>رواد التعليم الطبي الرقمي</span>
          </h1>
          <p style={{fontSize:'clamp(14px,2vw,17px)', color:'rgba(255,255,255,.65)', maxWidth:600, margin:'0 auto 32px', lineHeight:1.85}}>
            نُقدّم محتوى طبياً عالي الجودة لطلاب الطب والمتخصصين الصحيين في العالم العربي،
            بأسلوب تفاعلي ومرن يناسب حياتك اليومية.
          </p>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            <Link href="/courses" className="btn-register" style={{textDecoration:'none', padding:'12px 28px', fontSize:15}}>
              <BookOpen size={16}/>تصفّح الدورات
            </Link>
            <Link href="/contact" style={{textDecoration:'none', padding:'12px 28px', fontSize:15, borderRadius:10, border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontWeight:700}}>
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="wrap" style={{marginTop:-36, position:'relative', zIndex:10, paddingBottom:0}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16}}>
          {STATS.map((s,i) => (
            <div key={i} className="card" style={{padding:'20px 16px', textAlign:'center', boxShadow:'var(--sh3)'}}>
              <div style={{fontSize:28, marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:28, fontWeight:900, color:'var(--alpha-green)', letterSpacing:'-.02em'}}>{s.value}</div>
              <div style={{fontSize:13, color:'var(--tx3)', fontWeight:600, marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="wrap" style={{paddingTop:48}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center'}} className="grid-2">
          <div>
            <p style={{fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--alpha-green)', marginBottom:12}}>رسالتنا</p>
            <h2 style={{fontSize:'clamp(22px,3vw,32px)', fontWeight:900, color:'var(--tx1)', lineHeight:1.3, marginBottom:16, letterSpacing:'-.02em'}}>
              جعل التعليم الطبي المتخصص في متناول الجميع
            </h2>
            <p style={{fontSize:15, color:'var(--tx3)', lineHeight:1.85, marginBottom:14}}>
              انطلقنا عام 2024 بحلم بسيط: أن يحصل كل طالب طب وممارس صحي في العالم العربي على تعليم طبي متخصص بجودة عالية وبأسعار مناسبة.
            </p>
            <p style={{fontSize:15, color:'var(--tx3)', lineHeight:1.85, marginBottom:24}}>
              نؤمن أن الطبيب المتعلم جيداً يُحسّن حياة مرضاه، لذلك نستثمر في بناء محتوى علمي دقيق يصل للطالب بأي وقت ومن أي مكان.
            </p>
            {['محتوى مراجَع من متخصصين معتمدين', 'شهادات إتمام رقمية معترف بها', 'دعم مستمر من المعلمين'].map((t,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:9, marginBottom:9}}>
                <CheckCircle size={16} style={{color:'var(--alpha-green)', flexShrink:0}}/>
                <span style={{fontSize:14, color:'var(--tx2)', fontWeight:500}}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)', borderRadius:20, padding:'48px 36px', textAlign:'center', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.05)'}}/>
            <Stethoscope size={52} style={{color:'rgba(255,255,255,.9)', margin:'0 auto 20px'}}/>
            <h3 style={{fontSize:22, fontWeight:900, color:'#fff', marginBottom:10}}>رؤيتنا 2030</h3>
            <p style={{fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.8}}>
              أن نكون المرجع الطبي التعليمي الأول في المنطقة العربية، وأن يتخرّج من منصتنا جيل من الأطباء المتميزين
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="wrap" style={{paddingTop:56}}>
        <div style={{textAlign:'center', marginBottom:36}}>
          <p style={{fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--alpha-green)', marginBottom:10}}>قيمنا</p>
          <h2 style={{fontSize:'clamp(20px,3vw,30px)', fontWeight:900, color:'var(--tx1)', letterSpacing:'-.02em'}}>ما الذي يميّزنا؟</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20}}>
          {VALUES.map(({icon:Icon, title, desc}, i) => (
            <div key={i} className="card" style={{padding:'24px 20px'}}>
              <div style={{width:44, height:44, borderRadius:12, background:'var(--alpha-green-l)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14}}>
                <Icon size={20} style={{color:'var(--alpha-green)'}}/>
              </div>
              <h3 style={{fontSize:15, fontWeight:800, color:'var(--tx1)', marginBottom:8}}>{title}</h3>
              <p style={{fontSize:13, color:'var(--tx3)', lineHeight:1.75}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="wrap" style={{paddingTop:56}}>
        <div style={{textAlign:'center', marginBottom:36}}>
          <p style={{fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--alpha-green)', marginBottom:10}}>الفريق</p>
          <h2 style={{fontSize:'clamp(20px,3vw,30px)', fontWeight:900, color:'var(--tx1)', letterSpacing:'-.02em'}}>من يقف خلف المنصة؟</h2>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, maxWidth:800, margin:'0 auto'}}>
          {TEAM.map((m, i) => (
            <div key={i} className="card" style={{padding:'28px 20px', textAlign:'center'}}>
              <div style={{width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#1B5E20,#4CAF50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color:'#fff', margin:'0 auto 16px', boxShadow:'0 4px 16px rgba(76,175,80,.3)'}}>
                {m.avatar}
              </div>
              <h3 style={{fontSize:15, fontWeight:800, color:'var(--tx1)', marginBottom:4}}>{m.name}</h3>
              <p style={{fontSize:12, color:'var(--alpha-green)', fontWeight:700, marginBottom:4}}>{m.role}</p>
              <p style={{fontSize:12, color:'var(--tx4)'}}>{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="wrap" style={{paddingTop:56}}>
        <div style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)', borderRadius:20, padding:'48px 36px', textAlign:'center'}}>
          <Star size={36} style={{color:'#A5D6A7', margin:'0 auto 16px'}}/>
          <h2 style={{fontSize:'clamp(20px,3vw,30px)', fontWeight:900, color:'#fff', marginBottom:12}}>ابدأ رحلتك الطبية اليوم</h2>
          <p style={{fontSize:15, color:'rgba(255,255,255,.7)', marginBottom:24, maxWidth:480, margin:'0 auto 24px'}}>
            انضم لأكثر من 10,000 طالب وممارس صحي يتعلمون معنا كل يوم
          </p>
          <Link href="/auth/register" className="btn-register" style={{textDecoration:'none', padding:'13px 32px', fontSize:16, background:'#fff', color:'var(--alpha-green)'}}>
            إنشاء حساب مجاني
          </Link>
        </div>
      </div>

    </div>
  )
}
