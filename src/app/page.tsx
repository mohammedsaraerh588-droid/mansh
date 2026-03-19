'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, CheckCircle, Stethoscope, GraduationCap, 
  ShieldCheck, Activity, Brain, PlayCircle,
  ArrowRight, Sparkles, Zap, Award, Star
} from 'lucide-react'

const features = [
  { 
    icon: Stethoscope, 
    title: 'محتوى طبي متخصص', 
    description: 'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح ومنظم.',
    color: 'from-cyan-500 to-teal-500'
  },
  { 
    icon: ShieldCheck, 
    title: 'شهادات إتمام رقمية', 
    description: 'احصل على شهادة إتمام معتمدة بعد إنهاء كل دورة بنجاح.',
    color: 'from-emerald-500 to-green-500'
  },
  { 
    icon: Brain, 
    title: 'اختبارات تفاعلية', 
    description: 'اختبر معلوماتك بعد كل وحدة مع تغذية راجعة فورية ومفصلة.',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: Activity, 
    title: 'حالات سريرية', 
    description: 'تعلّم من خلال حالات واقعية تربط النظرية بالتطبيق العملي.',
    color: 'from-orange-500 to-red-500'
  },
  { 
    icon: BookOpen, 
    title: 'محتوى نصي وفيديو', 
    description: 'دروس بشروحات نصية ومقاطع فيديو عالية الجودة لتناسب أسلوبك.',
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    icon: Users, 
    title: 'مجتمع طلابي', 
    description: 'تواصل مع زملائك وتبادل المعرفة في بيئة تعاونية محفزة.',
    color: 'from-rose-500 to-pink-500'
  },
]

const stats = [
  { value: '5,000+', label: 'دورة مكتملة', icon: BookOpen },
  { value: '2,500+', label: 'طالب مسجل', icon: Users },
  { value: '95%', label: 'معدل رضا', icon: Star },
  { value: '1,200+', label: 'شهادة مُصدرة', icon: Award },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">أكبر منصة تعليم طبي عربية</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-white">منصة</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              تعلّم
            </span>
            <br />
            <span className="text-slate-400 font-light">الطبية</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            تعلّم الطب بأسلوب عصري وتفاعلي من خلال دورات مصمّمة خصيصاً 
            للطلاب والممارسين الصحيين في العالم العربي
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link 
              href="/courses" 
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                استكشف الدورات
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/auth/register" 
              className="px-8 py-4 border border-slate-700 rounded-xl font-semibold text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 transition-all"
            >
              سجّل مجاناً
            </Link>
          </motion.div>

          {/* Stats Preview */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              لماذا تختار <span className="text-gradient-cyan">منصتنا</span>؟
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              نقدم لك تجربة تعليمية فريدة تجمع بين الجودة العالية والتصميم العصري
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index}
                  className="group relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
                  variants={itemVariants}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 to-teal-500/0 group-hover:from-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500 -z-10" />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20" />
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ابدأ رحلتك التعليمية الآن
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                انضم إلى آلاف الطلاب والممارسين الصحيين الذين يطورون مهاراتهم معنا
              </p>
              <Link 
                href="/auth/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                ابدأ التعلم المجاني
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
