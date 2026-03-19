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
    <div className="bg-bg min-h-screen overflow-x-hidden">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border/50">
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-mint/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        
        <div className="wrap relative z-10 text-center">
          <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 border border-navy/10 mb-8 backdrop-blur-sm">
            <Stethoscope size={14} className="text-navy" />
            <span className="text-[11px] font-bold text-navy tracking-wider uppercase">المنصة الرائدة للتعليم الطبي العربي</span>
          </div>

          <h1 className="fade-up block text-4xl md:text-7xl font-black text-navy leading-[1.1] mb-6 tracking-tight" style={{ animationDelay: '0.1s' }}>
            تعلّم الطب بكافة أبعاده<br />
            <span className="text-navy3 italic">بأسلوب عصريٍّ ومبتكر</span>
          </h1>

          <p className="fade-up text-lg md:text-xl text-txt2 max-w-2xl mx-auto mb-10 leading-relaxed font-medium" style={{ animationDelay: '0.2s' }}>
            نقدم لك تجربة تعليمية طبية متكاملة تجمع بين الدقة العلمية وأحدث تقنيات التعليم التفاعلي، تحت إشراف نخبة من الأخصائيين.
          </p>

          <div className="fade-up flex flex-wrap justify-center gap-4 mb-16" style={{ animationDelay: '0.3s' }}>
            <Link href="/courses" className="btn btn-primary btn-xl group">
              استكشف المسارات <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link href="/auth/register" className="btn btn-white btn-xl">
              ابدأ رحلتك مجاناً <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="fade-up flex flex-wrap justify-center gap-8 md:gap-12 opacity-60" style={{ animationDelay: '0.4s' }}>
            {['شروحات وافية', 'شهادات معتمدة', 'تحديثات دورية'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-bold text-navy">
                <CheckCircle size={16} className="text-mint" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="wrap">
          <div className="text-center mb-16 md:mb-20">
            <span className="eyebrow"><FlaskConical size={12} /> لماذا منصة تعلّم؟</span>
            <h2 className="text-3xl md:text-5xl font-black text-navy mt-4 mb-6">تجربة تعليمية بلا حدود</h2>
            <p className="text-txt2 max-w-xl mx-auto text-lg leading-relaxed">
              سواء كنت طالباً أو ممارساً صحياً، نوفر لك الأدوات اللازمة للتميز في مسيرتك المهنية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map(({ I, t, d }, i) => (
              <div key={i} className="card card-hover p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-bg2 flex items-center justify-center mb-6 group-hover:bg-navy transition-colors duration-300">
                  <I size={24} className="text-navy group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{t}</h3>
                <p className="text-txt2 leading-relaxed text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / NEW ERA SECTION ── */}
      <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(100,255,218,0.3) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-mint/5 blur-[150px] pointer-events-none" />
        
        <div className="wrap relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-mint tracking-[0.2em] uppercase">انضم لآلاف المبدعين</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight">
                هل أنت مستعد لنقل معرفتك<br /> الطبية إلى المستوى التالي؟
            </h2>
            <p className="text-txt1/60 text-lg md:text-xl max-w-2xl mx-auto mb-12" style={{color: 'rgba(204, 214, 246, 0.6)'}}>
                ابدأ اليوم وكن جزءاً من أكبر مجتمع تعليمي طبي في العالم العربي. الرحلة تبدأ بضغطة زر.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                <Link href="/auth/register" className="btn btn-mint btn-xl">
                    سجل الآن مجاناً <GraduationCap size={20} />
                </Link>
                <Link href="/courses" className="btn btn-outline btn-xl !border-white !text-white hover:!bg-white hover:!text-navy">
                    تصفح جميع المسارات
                </Link>
            </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-mint/5 blur-[100px] pointer-events-none" />
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center border border-white/10 shadow-lg transition-transform group-hover:scale-110">
                  <Stethoscope size={22} className="text-navy" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">منصة <span className="text-mint italic font-serif">تعلّم</span></div>
                  <div className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">The Medical Arena</div>
                </div>
              </Link>
              <p className="text-txt1/40 leading-loose max-w-sm mb-8" style={{color: 'rgba(136, 146, 176, 0.7)'}}>
                المرجع الأول لطلاب الطب والأطباء في الوطن العربي. نسعى لتقديم محتوى تعليمي رصين يواكب التطورات العلمية العالمية.
              </p>
            </div>

            {[
              { title: 'المنصة', links: [['/', 'الرئيسية'], ['/courses', 'الدورات'], ['/auth/register', 'سجّل مجاناً'], ['/auth/login', 'تسجيل الدخول']] },
              { title: 'روابط هامة', links: [['/terms', 'الشروط والأحكام'], ['/privacy', 'سياسة الخصوصية'], ['/contact', 'تواصل معنا']] },
            ].map(({ title, links }, i) => (
              <div key={i}>
                <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase border-r-2 border-mint pr-4">{title}</h4>
                <ul className="flex flex-direction-column gap-4">
                  {links.map(([h, l]) => (
                    <li key={h}>
                      <Link href={h} className="text-txt1/40 hover:text-mint transition-colors duration-200 text-sm" style={{color: 'rgba(136, 146, 176, 0.7)'}}>{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-xs tracking-wide font-medium">© {new Date().getFullYear()} منصة تعلّم الطبية. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">Designed for Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

