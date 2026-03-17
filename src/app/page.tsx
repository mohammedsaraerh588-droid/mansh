import Link from 'next/link'
import { BookOpen, Star, Users, BrainCircuit, Rocket, ShieldCheck, PlayCircle, Zap, Trophy, Globe, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ===== HERO ===== */}
      <section className="hero-bg min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="max-w-3xl mx-auto text-center">

            {/* Eyebrow */}
            <p className="text-xs font-black tracking-widest uppercase mb-8 slide-up" style={{color:'var(--gold)', letterSpacing:'0.2em', animationDelay:'0s'}}>
              ✦ منصة التعليم العربي الراقية ✦
            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight slide-up" style={{animationDelay:'0.1s', letterSpacing:'-0.02em'}}>
              طوّر مهاراتك
              <br />
              <span className="gradient-text">بمستوى احترافي</span>
            </h1>

            {/* Gold separator */}
            <div className="gold-separator my-8 slide-up" style={{animationDelay:'0.2s'}} />

            <p className="text-lg text-white/65 mb-12 max-w-xl mx-auto leading-relaxed slide-up" style={{animationDelay:'0.25s'}}>
              دورات تدريبية متخصصة يُقدّمها خبراء معتمدون، مع شهادات رقمية تُثبت كفاءتك أمام سوق العمل.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up" style={{animationDelay:'0.3s'}}>
              <Link href="/courses">
                <button className="btn-gold flex items-center gap-2.5 px-9 py-3.5 text-base rounded-lg">
                  <Rocket className="w-5 h-5" />
                  استكشف الدورات
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="flex items-center gap-2.5 px-9 py-3.5 text-base rounded-lg font-bold text-white/80 border border-white/20 hover:border-white/50 hover:text-white transition-all duration-300">
                  إنشاء حساب مجاني
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-24 max-w-3xl mx-auto border border-white/10 rounded-2xl overflow-hidden slide-up" style={{animationDelay:'0.45s'}}>
            {[
              { label: 'طالب مسجّل', value: '+10,000', icon: Users },
              { label: 'دورة متاحة', value: '+500', icon: BookOpen },
              { label: 'تقييم المنصة', value: '4.9 / 5', icon: Star },
              { label: 'معلم خبير', value: '+100', icon: Trophy },
            ].map((s,i) => (
              <div key={i} className="flex flex-col items-center justify-center py-8 px-4 text-center" style={{background:'rgba(255,255,255,0.04)'}}>
                <s.icon className="w-5 h-5 mb-3" style={{color:'var(--gold)'}} />
                <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-white/45 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <p className="section-label">لماذا تختارنا</p>
            <h2 className="section-title">تجربة تعليمية لا مثيل لها</h2>
            <div className="gold-separator mt-6" />
            <p className="section-subtitle">كل تفصيلة في المنصة صُمِّمت بعناية لتمنحك أفضل رحلة تعلّم ممكنة.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'فيديو بجودة عالية', desc: 'دروس مصوّرة بدقة فائقة، مع إمكانية المشاهدة في أي وقت ومن أي جهاز.', icon: PlayCircle },
              { title: 'شهادات موثّقة', desc: 'شهادات إتمام رقمية قابلة للتحقق، تُضيفها مباشرة لملفك المهني.', icon: ShieldCheck },
              { title: 'اختبارات تفاعلية', desc: 'قيّم مستواك الحقيقي باختبارات متدرجة مع تغذية راجعة فورية ومفصّلة.', icon: BrainCircuit },
              { title: 'وصول مدى الحياة', desc: 'تملّك الدورة للأبد — راجع المحتوى متى شئت بدون أي قيود زمنية.', icon: Globe },
              { title: 'معلمون متخصصون', desc: 'كل دورة بإشراف خبير في مجاله، مع سنوات من التجربة العملية.', icon: Trophy },
              { title: 'محتوى محدَّث دائماً', desc: 'نحرص على مواكبة كل جديد في كل تخصص لتبقى دائماً في الطليعة.', icon: Zap },
            ].map((f,i) => (
              <div key={i} className="glass-card-hover p-8 group border-b-2 border-transparent hover:border-b-gold" style={{'--gold-border':'var(--gold)'} as any}>
                <div className="feature-icon">
                  <f.icon className="w-6 h-6" style={{color:'var(--gold)'}} />
                </div>
                <h3 className="text-lg font-black mb-3 text-primary">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-28" style={{background:'var(--surface-2)'}}>
        <div className="container mx-auto px-4">
          <div className="section-header">
            <p className="section-label">خطوات بسيطة</p>
            <h2 className="section-title">ابدأ في ثلاث خطوات</h2>
            <div className="gold-separator mt-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { n:'01', title:'أنشئ حسابك', desc:'سجّل مجاناً في أقل من دقيقة واختر مجالك الذي تريد الاحتراف فيه.' },
              { n:'02', title:'اختر دورتك', desc:'تصفّح مئات الدورات في مختلف التخصصات وابدأ التعلّم فوراً.' },
              { n:'03', title:'احصل على شهادتك', desc:'أنهِ الدورة واحصل على شهادة رقمية معتمدة تُضيفها لسيرتك الذاتية.' },
            ].map((s,i) => (
              <div key={i} className="text-center group">
                <div className="step-number mb-2 group-hover:opacity-60 transition-opacity">{s.n}</div>
                <div className="divider-gold mx-auto mb-5" />
                <h3 className="text-xl font-black mb-3" style={{color:'var(--primary)'}}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="hero-bg py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-black tracking-widest uppercase mb-6" style={{color:'var(--gold)', letterSpacing:'0.2em'}}>
              ✦ انضم إلى المجتمع ✦
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              رحلتك نحو الاحتراف<br/>تبدأ اليوم
            </h2>
            <div className="gold-separator my-8" />
            <p className="text-white/60 text-base mb-10 leading-relaxed">
              أكثر من 10,000 طالب عربي يتعلمون معنا كل يوم — كن واحداً منهم.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <button className="btn-gold flex items-center gap-2.5 px-9 py-3.5 text-base rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                  ابدأ مجاناً الآن
                </button>
              </Link>
              <Link href="/courses">
                <button className="flex items-center gap-2.5 px-9 py-3.5 text-base rounded-lg font-bold text-white/70 border border-white/20 hover:border-white/50 hover:text-white transition-all duration-300">
                  تصفّح الدورات
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-6 mt-12">
              {['تسجيل مجاني بالكامل','شهادات معتمدة','دعم على مدار الساعة'].map((t,i)=>(
                <div key={i} className="flex items-center gap-2" style={{color:'rgba(255,255,255,0.45)'}}>
                  <CheckCircle className="w-4 h-4" style={{color:'var(--gold)'}} />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t" style={{background:'var(--primary)', borderColor:'rgba(255,255,255,0.06)'}}>
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base" style={{background:'var(--gradient-gold)', color:'var(--primary)'}}>م</div>
            <span className="text-lg font-black text-white">منصة <span className="gradient-text">تعلّم</span></span>
          </div>
          <p className="text-xs font-medium" style={{color:'rgba(255,255,255,0.3)'}}>
            © {new Date().getFullYear()} منصة تعلّم — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

    </div>
  )
}
