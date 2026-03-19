'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BookOpen, Users, CheckCircle,
         Stethoscope, GraduationCap, ShieldCheck,
         Activity, Brain, PlayCircle, FlaskConical } from 'lucide-react'

const features = [
  { I:Stethoscope,  t:'محتوى طبي متخصص',     d:'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح.' },
  { I:ShieldCheck,  t:'شهادات إتمام رقمية',    d:'احصل على شهادة إتمام بعد إنهاء كل دورة بنجاح.' },
  { I:Brain,        t:'اختبارات تفاعلية',       d:'اختبر معلوماتك بعد كل وحدة مع تغذية راجعة فورية.' },
  { I:Activity,     t:'حالات سريرية',           d:'تعلّم من خلال حالات واقعية تربط النظرية بالتطبيق.' },
  { I:BookOpen,     t:'محتوى نصي وفيديو',       d:'دروس بشروحات نصية ومقاطع فيديو لتناسب أسلوبك.' },
  { I:Users,        t:'مجتمع طلابي',            d:'تواصل مع زملائك وتبادل المعرفة في بيئة تعاونية.' },
]

const stats = [
  { n:5000, l:'دورة مكتملة' },
  { n:2500, l:'طالب مسجل' },
  { n:95, l:'معدل رضا' },
  { n:1200, l:'شهادة مُصدرة' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[100vh]">
        {/* Parallax Layers */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-mint/20 to-transparent blur-xl"
            initial={{ scale: 1.5, y: 100 }}
            animate={{ scale: 1.4, y: 50 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_600px_at_20%_80%,rgba(100,255,218,0.15),transparent)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 wrap flex flex-col h-screen justify-center items-center text-center px-6 pt-32 pb-20">
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-3 h-3 bg-mint rounded-full animate-pulse" />
            <span className="text-white font-bold text-sm tracking-wide uppercase">أكبر منصة تعليم طبي عربية</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-mint to-gold mb-8 px-4 -skew-x-3 tracking-[-0.05em]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            منصة <span className="text-mint -skew-x-6">تعلّم</span> 
            <br />
            <span className="text-6xl md:text-7xl font-serif italic block -skew-x-6 bg-gradient-to-r from-gold to-mint bg-clip-text text-transparent tracking-normal">الطبية
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 px-6 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            تعلّم الطب بأسلوب <span className="text-mint font-bold">عصري وتفاعلي</span> من خلال دورات مصمّمة خصيصاً 
            للطلاب والممارسين الصحيين في العالم العربي.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 px-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link 
              href="/courses" 
              className="group btn btn-mint btn-xl flex items-center gap-3 shadow-2xl backdrop-blur-lg"
            >
              <PlayCircle size={24} />
              استكشف الدورات
              <motion.div 
                className="w-3 h-3 bg-gradient-to-r from-white to-transparent rounded-full ml-auto opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring" }}
              />
            </Link>
            <Link 
              href="/auth/register" 
              className="btn btn-primary btn-xl shadow-2xl backdrop-blur-lg"
            >
              ابدأ رحلتك مجاناً <CheckCircle size={20} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-12 mt-24 px-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {stats.map(({ n, l }, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-mint mb-2 animate-pulse">
                  {n.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm font-medium uppercase tracking-wide">
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-gradient-to-b from-white/50 to-white/0">
        <div className="wrap">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint/10 border border-mint/20 mb-8 backdrop-blur">
              <FlaskConical size={14} />
              <span className="text-sm font-bold text-navy tracking-wide uppercase">ما يميز منصتنا</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-navy mb-6">تجربة تعليمية <span className="text-mint">متميّزة</span></h2>
            <p className="text-xl text-txt2 max-w-2xl mx-auto leading-relaxed">
              كل تفاصيل التصميم والمحتوى مصمّمة لتوفير أفضل تجربة تعليمية ممكنة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {features.map(({ I, t, d }, i) => (
                <motion.div 
                  key={i}
                  className="group flex items-start gap-6 p-8 rounded-3xl bg-white/70 border border-white/30 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:-translate-x-4 transition-all duration-500 hover:border-mint/50"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint to-primary flex items-center justify-center flex-shrink-0 shadow-xl mt-1 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotateY: 10, rotateX: 5 }}
                  >
                    <I size={24} className="text-white drop-shadow-lg" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-navy mb-3 group-hover:text-mint transition-colors">{t}</h3>
                    <p className="text-txt2 leading-relaxed">{d}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-mint/10 to-gold/5 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-3xl p-12 shadow-3xl border border-white/20 backdrop-blur-xl">
                <Image 
                  src="/images/medical/student-learning.jpg" 
                  alt="Medical Student Learning"
                  width={500}
                  height={400}
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                />
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-mint/5 p-4 rounded-xl border border-mint/20 text-center">
                    <div className="text-2xl font-black text-mint mb-1">98%</div>
                    <div className="text-xs text-navy/60 font-medium uppercase tracking-wide">معدل رضا</div>
                  </div>
                  <div className="bg-gold/5 p-4 rounded-xl border border-gold/20 text-center">
                    <div className="text-2xl font-black text-gold mb-1">12K+</div>
                    <div className="text-xs text-navy/60 font-medium uppercase tracking-wide">متعلمين</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 to-navy pointer-events-none" />
        <div className="relative z-10 wrap text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-mint text-navy font-bold text-xl backdrop-blur-xl shadow-2xl border border-mint/50 mb-12"
          >
            <div className="w-3 h-3 bg-navy rounded-full" />
            جاهز للبدء؟ 
          </motion.div>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-8"
          >
            انضم لثورة <span className="text-mint block">التعليم الطبي</span>
          </motion.h2>

          <motion.div 
            className="flex flex-col lg:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/auth/register" 
              className="btn btn-mint btn-xl shadow-2xl hover:shadow-3xl px-12"
            >
              سجّل مجاناً <GraduationCap />
            </Link>
            <div className="flex items-center gap-8 text-white/60 font-medium text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-mint rounded-full animate-pulse" />
                <span>ابدأ فوراً</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />
                <span>دفع آمن</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

