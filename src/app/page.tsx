import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BookOpen, Star, Users, BrainCircuit, Rocket, ShieldCheck, PlayCircle, Zap, Trophy, Globe, ArrowLeft, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ===== HERO ===== */}
      <section className="hero-bg min-h-screen flex items-center relative pt-20">
        {/* Orbs */}
        <div className="orb w-96 h-96 bg-violet-500 top-20 right-10" />
        <div className="orb w-72 h-72 bg-indigo-500 bottom-20 left-20" />
        <div className="orb w-48 h-48 bg-purple-400 top-1/2 left-1/2" style={{transform:'translate(-50%,-50%)'}} />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 slide-up backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              🚀 منصة الجيل القادم للتعليم العربي
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white slide-up" style={{animationDelay:'0.1s'}}>
              تعلّم بثقة،{' '}
              <span className="relative inline-block">
                <span className="gradient-text">احترف</span>
                <svg className="absolute -bottom-2 right-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
              {' '}بسرعة
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed slide-up" style={{animationDelay:'0.2s'}}>
              منصة تعليمية متكاملة بأحدث الدورات في التقنية والأعمال والتصميم — مع أفضل المعلمين العرب خبرة واحترافاً.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up" style={{animationDelay:'0.3s'}}>
              <Link href="/courses">
                <button className="btn-primary btn-gradient-animated flex items-center gap-3 px-8 py-4 text-lg rounded-2xl">
                  <Rocket className="w-5 h-5" />
                  استكشف الدورات
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="flex items-center gap-3 px-8 py-4 text-lg rounded-2xl font-bold text-white border-2 border-white/20 hover:border-white/50 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                  <PlayCircle className="w-5 h-5" />
                  ابدأ مجاناً
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 slide-up" style={{animationDelay:'0.4s'}}>
              {['✅ بدون رسوم تسجيل','🔒 شهادات معتمدة','⭐ أكثر من 4.9 تقييم'].map((t,i) => (
                <span key={i} className="text-white/60 text-sm font-medium hidden sm:block">{t}</span>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto slide-up" style={{animationDelay:'0.5s'}}>
            {[
              { label: 'طالب مسجّل', value: '+10K', icon: Users, color: 'text-violet-300' },
              { label: 'دورة تدريبية', value: '+500', icon: BookOpen, color: 'text-indigo-300' },
              { label: 'تقييم المنصة', value: '4.9★', icon: Star, color: 'text-yellow-300' },
              { label: 'معلم خبير', value: '+100', icon: Trophy, color: 'text-emerald-300' },
            ].map((s,i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{background:'var(--gradient-1)'}} />
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div className="section-label">✨ لماذا نحن مختلفون</div>
            <h2 className="section-title">كل ما تحتاجه للنجاح في مكان واحد</h2>
            <p className="section-subtitle">صمّمنا كل تفصيلة لتضمن لك أفضل تجربة تعليمية باللغة العربية.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'فيديو عالي الجودة', desc: 'دروس مصوّرة بدقة عالية مع إمكانية التحميل والمشاهدة أوفلاين.', icon: PlayCircle, gradient: 'from-violet-500 to-purple-600' },
              { title: 'شهادات موثّقة', desc: 'شهادات إتمام رقمية قابلة للتحقق يمكن إضافتها لملفك على LinkedIn.', icon: ShieldCheck, gradient: 'from-indigo-500 to-blue-600' },
              { title: 'اختبارات ذكية', desc: 'قيّم مستواك باستمرار عبر اختبارات تفاعلية مع تغذية راجعة فورية.', icon: BrainCircuit, gradient: 'from-emerald-500 to-teal-600' },
              { title: 'تعلّم بأي وقت', desc: 'وصول مدى الحياة لجميع محتويات الدورة من أي جهاز في أي مكان.', icon: Globe, gradient: 'from-orange-500 to-amber-600' },
              { title: 'معلمون خبراء', desc: 'كل دورة مُقدَّمة من متخصص معتمد بسنوات خبرة حقيقية في المجال.', icon: Trophy, gradient: 'from-rose-500 to-pink-600' },
              { title: 'محتوى محدّث', desc: 'نحرص على تحديث المحتوى باستمرار لمواكبة آخر تطورات كل مجال.', icon: Zap, gradient: 'from-yellow-500 to-orange-500' },
            ].map((f,i) => (
              <div key={i} className="glass-card-hover p-8 group">
                <div className={`feature-icon bg-gradient-to-br ${f.gradient}`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 text-secondary group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-surface-2">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div className="section-label">🎯 كيف تبدأ</div>
            <h2 className="section-title">ثلاث خطوات للاحتراف</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step:'01', title:'سجّل حسابك', desc:'أنشئ حسابك المجاني في أقل من دقيقة واختر مجالك.', color:'bg-violet-100 text-violet-600' },
              { step:'02', title:'اختر دورتك', desc:'تصفّح مئات الدورات وابدأ التعلّم فوراً.', color:'bg-indigo-100 text-indigo-600' },
              { step:'03', title:'احصل على شهادتك', desc:'أكمل الدورة واحصل على شهادة رقمية معتمدة.', color:'bg-emerald-100 text-emerald-600' },
            ].map((s,i) => (
              <div key={i} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center text-2xl font-black mx-auto mb-5 shadow-sm`}>
                  {s.step}
                </div>
                {i < 2 && <div className="hidden md:block absolute top-8 left-0 w-full border-t-2 border-dashed border-border -z-10" style={{width:'calc(100% - 4rem)',right:'calc(50% + 2rem)'}} />}
                <h3 className="text-xl font-black mb-2 text-secondary">{s.title}</h3>
                <p className="text-text-secondary text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 relative overflow-hidden hero-bg">
        <div className="orb w-64 h-64 bg-violet-400 top-0 right-1/4" />
        <div className="orb w-48 h-48 bg-indigo-400 bottom-0 left-1/4" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl mb-6">🎓</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">مستعد لبدء رحلتك؟</h2>
            <p className="text-xl text-white/70 mb-10">انضم لأكثر من 10,000 طالب عربي يتعلمون كل يوم ويحققون أهدافهم المهنية.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <button className="btn-primary btn-gradient-animated flex items-center gap-3 px-10 py-4 text-lg rounded-2xl">
                  <Rocket className="w-5 h-5" />
                  أنشئ حسابك مجاناً
                </button>
              </Link>
              <Link href="/courses">
                <button className="flex items-center gap-3 px-8 py-4 text-lg rounded-2xl font-bold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all">
                  تصفّح الدورات
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-10">
              {['لا يوجد بطاقة ائتمان مطلوبة','إلغاء في أي وقت','دعم مجاني 24/7'].map((t,i)=>(
                <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-secondary text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white" style={{background:'var(--gradient-1)'}}>م</div>
            <span className="text-xl font-black text-white">منصة <span className="gradient-text">تعلّم</span></span>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} منصة تعلّم — جميع الحقوق محفوظة</p>
        </div>
      </footer>

    </div>
  )
}
