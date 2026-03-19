'use client'
// Updated design - Light theme
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Stethoscope, 
  ShieldCheck, Activity, Brain,
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
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
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-cyan-600 text-sm font-medium">المنصة الرائدة للتعليم الطبي العربي</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-slate-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            تعلّم الطب بكافة أبعاده
            <br />
            <span className="text-slate-800">بأسلوب عصريّ ومبتكر</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            نقدم لك تجربة تعليمية طبية متكاملة تجمع بين الدقة العلمية وأحدث تقنيات التعليم التفاعلي، 
            تحت إشراف نخبة من الأخصائيين.
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
              className="group relative px-8 py-4 bg-slate-900 rounded-xl font-semibold text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-slate-500/25 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                استكشف المسارات
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/auth/register" 
              className="px-8 py-4 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all"
            >
              ← ابدأ رحلتك مجاناً
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
                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              تجربة تعليمية <span className="text-gradient-cyan">بلا حدود</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              سواء كنت طالباً أو ممارساً صحياً، نوفر لك الأدوات اللازمة للتميز في مسيرتك المهنية
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
                  className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  variants={itemVariants}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="relative rounded-3xl overflow-hidden bg-white shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Content */}
            <div className="relative p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                ابدأ رحلتك التعليمية الآن
              </h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">
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
