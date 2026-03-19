'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { 
  BookOpen, Award, Flame, Clock, Loader2, 
  TrendingUp, Users, Star, Target, Zap,
  ArrowRight, Play, CheckCircle
} from 'lucide-react'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(p)
      const { data:e } = await supabase.from('enrollments')
        .select('progress_percentage,enrolled_at,courses(id,title,slug,thumbnail_url,duration_hours,level,total_lessons,price,currency,avg_rating,total_reviews,total_students,category_id)')
        .eq('student_id',session.user.id).order('enrolled_at',{ascending:false})
      setEnrollments(e||[])
      setLoading(false)
    })()
  },[])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">جاري تحميل لوحة التحكم...</p>
      </div>
    </div>
  )

  const done = enrollments.filter(e=>e.progress_percentage===100).length
  const inProgress = enrollments.length - done
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length)
    : 0

  const stats = [
    { 
      label: 'الدورات المسجلة', 
      value: enrollments.length, 
      icon: BookOpen, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    { 
      label: 'قيد الإنجاز', 
      value: inProgress, 
      icon: Flame, 
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    { 
      label: 'الشهادات المكتسبة', 
      value: done, 
      icon: Award, 
      color: 'from-emerald-500 to-green-500',
      bgColor: 'from-emerald-50 to-green-50'
    },
    { 
      label: 'معدل التقدم', 
      value: `${avgProgress}%`, 
      icon: Target, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">لوحة الطالب</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              أهلاً، {profile?.full_name?.split(' ')[0] || 'طالب'}! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              واصل مسيرتك التعليمية وحقق أهدافك اليوم. أنت تقوم بعمل رائع!
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/courses"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  استكشف دورات جديدة
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/dashboard/student/certificates"
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  شهاداتي
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`relative bg-gradient-to-br ${stat.bgColor} border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl w-fit mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">دوراتي الحالية</h2>
            <Link 
              href="/dashboard/student/courses"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <motion.div 
              className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لم تسجل في أي دورة بعد</h3>
              <p className="text-gray-600 mb-6">ابدأ رحلتك التعليمية بالانضمام إلى إحدى دوراتنا المتميزة</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/courses"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  استكشف الدورات
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {enrollments.slice(0, 3).map((enrollment, index) => (
                <motion.div
                  key={enrollment.courses.id}
                  className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{enrollment.courses.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {enrollment.courses.duration_hours} ساعة
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {enrollment.courses.total_students || 0} طالب
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">التقدم</span>
                          <span className="font-bold text-blue-600">{enrollment.progress_percentage}%</span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${enrollment.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {enrollment.progress_percentage === 100 ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          مكتملة
                        </div>
                      ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            href={`/courses/${enrollment.courses.slug}/learn`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            استئناف التعلم
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
