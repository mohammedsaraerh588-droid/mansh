'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Stethoscope, 
  ShieldCheck, Activity, Brain,
  ArrowRight, Sparkles, Zap, Award, Star,
  Play, TrendingUp, Globe, Heart
} from 'lucide-react'

const features = [
  { 
    icon: Stethoscope, 
    title: 'محتوى طبي متخصص', 
    description: 'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح ومنظم.',
    color: 'from-cyan-500 to-teal-500',
    bgGradient: 'from-cyan-500/10 to-teal-500/10',
    borderColor: 'border-cyan-500/20'
  },
  { 
    icon: ShieldCheck, 
    title: 'شهادات إتمام رقمية', 
    description: 'احصل على شهادة إتمام معتمدة بعد إنهاء كل دورة بنجاح.',
    color: 'from-emerald-500 to-green-500',
    bgGradient: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-500/20'
  },
  { 
    icon: Brain, 
    title: 'اختبارات تفاعلية', 
    description: 'اختبر معلوماتك بعد كل وحدة مع تغذية راجعة فورية ومفصلة.',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20'
  },
  { 
    icon: Activity, 
    title: 'حالات سريرية', 
    description: 'تعلّم من خلال حالات واقعية تربط النظرية بالتطبيق العملي.',
    color: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/20'
  },
  { 
    icon: BookOpen, 
    title: 'محتوى نصي وفيديو', 
    description: 'دروس بشروحات نصية ومقاطع فيديو عالية الجودة لتناسب أسلوبك.',
    color: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/20'
  },
  { 
    icon: Users, 
    title: 'مجتمع طلابي', 
    description: 'تواصل مع زملائك وتبادل المعرفة في بيئة تعاونية محفزة.',
    color: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-500/20'
  },
]

const stats = [
  { number: '10,000+', label: 'طالب مسجل', icon: Users },
  { number: '50+', label: 'دورة طبية', icon: BookOpen },
  { number: '95%', label: 'معدل الرضا', icon: Heart },
  { number: '24/7', label: 'دعم فني', icon: TrendingUp },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">منصة التعليم الطبي الرائدة في المنطقة</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
              تعلم الطب
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl">بشكل احترافي</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              انضم إلى آلاف الطلاب والطبيبات في رحلتك نحو التميز في الممارسة الطبية من خلال دورات تفاعلية ومحتوى عالي الجودة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/courses" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
                >
                  استكشف الدورات
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/auth/register" 
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                >
                  <Play className="w-5 h-5" />
                  ابدأ مجاناً
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              لماذا تختار
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> منصتنا؟</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نوفر لك أفضل تجربة تعليمية طبية بتقنيات حديثة ومحتوى موثوق
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-xl`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-4xl p-12 text-center text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <Award className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى آلاف الطلاب الذين حققوا نجاحاً باهراً في مسيرتهم الطبية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/auth/register" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  سجل الآن مجاناً
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/courses" 
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                >
                  تصفح الدورات
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
