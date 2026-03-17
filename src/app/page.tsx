import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BookOpen, Star, Users, BrainCircuit, Rocket, ShieldCheck, PlayCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 hero-sphere animate-pulse-glow" style={{ transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 hero-sphere" style={{ transform: 'translate(-30%, 30%)' }} />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-secondary/10 hero-sphere" style={{ transform: 'translate(-50%, -50%)' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 animate-fade-in slide-up">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              منصة الجيل القادم للتعليم العربي
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight slide-up" style={{ animationDelay: '0.1s' }}>
              ارتقِ بمهاراتك نحو <br className="hidden md:block" />
              <span className="gradient-text">الاحترافية</span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed slide-up" style={{ animationDelay: '0.2s' }}>
              منصة تعليمية متكاملة تقدم أحدث الدورات في مختلف المجالات لتواكب متطلبات سوق العمل. انضم لآلاف المتعلمين وابدأ رحلتك اليوم.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/courses">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<Rocket className="w-5 h-5" />}>
                  استكشف الدورات
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  إنشاء حساب مجاني
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 slide-up" style={{ animationDelay: '0.4s' }}>
              {[
                { label: 'طالب مسجل', value: '+10,000', icon: Users },
                { label: 'دورة تدريبية', value: '+500', icon: BookOpen },
                { label: 'تقييم إيجابي', value: '4.9/5', icon: Star },
                { label: 'معلم خبير', value: '+100', icon: BrainCircuit },
              ].map((stat, i) => (
                <div key={i} className="glass-card-hover p-6 rounded-2xl flex items-center gap-4 bg-white border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary-dark">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-surface-2 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div className="section-label">المميزات الرئيسية</div>
            <h2 className="section-title">كل ما تحتاجه للنجاح</h2>
            <p className="section-subtitle">
              صممنا المنصة لتوفير أفضل تجربة تعليمية ممكنة، سواء كنت طالباً أو معلماً.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'محتوى عالي الجودة', desc: 'دورات مسجلة ومباشرة بأعلى جودة بصرية وصوتية لضمان وصول المعلومة.', icon: PlayCircle, color: 'text-primary' },
              { title: 'شهادات معتمدة', desc: 'احصل على شهادات إتمام قابلة للتحقق عند إكمالك للدورات بنجاح.', icon: ShieldCheck, color: 'text-accent' },
              { title: 'اختبارات وتقييم', desc: 'اختبر معلوماتك باستمرار عبر نظام التقييم والاختبارات المدمج.', icon: BrainCircuit, color: 'text-secondary' },
            ].map((feat, i) => (
              <div key={i} className="glass-card-hover p-8 text-center flex flex-col items-center bg-white border border-border">
                <div className={`w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-6 shadow-sm border border-border ${feat.color}`}>
                  <feat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary-light border-y border-border">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">مستعد لبدء رحلتك التعليمية؟</h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            انضم الآن وابدأ التعلم فوراً، المئات من الدورات في انتظارك للبدء والوصول لأهدافك.
          </p>
          <Link href="/auth/register">
            <Button variant="primary" size="lg" className="px-12 py-4 shadow-xl shadow-primary/30">
              أنشئ حسابك مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-2 border-t border-border text-center text-text-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
              م
            </div>
            <span className="text-lg font-bold text-secondary">منصة تعلّم</span>
          </div>
          <p>© {new Date().getFullYear()} منصة تعلّم. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
