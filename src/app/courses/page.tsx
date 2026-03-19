'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Search, Loader2, BookOpen, SlidersHorizontal, Stethoscope, Clock, Users, Star, Heart, TrendingUp, Award, Play } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)

      const { data: crs, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      
      if (crs) setCourses(crs)
      setLoading(false)
    })()
  }, [])

  const filtered = courses.filter(c => {
    const matchesSearch = c.title_ar?.toLowerCase().includes(search.toLowerCase()) ||
                        c.description_ar?.toLowerCase().includes(search.toLowerCase())
    const matchesCat = cat === 'all' || c.category_id === cat
    return matchesSearch && matchesCat
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الدورات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              اكتشف دوراتنا الطبية
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              اختر من بين مجموعة واسعة من الدورات الطبية عالية الجودة المصممة خصيصاً للطلاب والطبيبات
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="ابحث عن دورة..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">جميع الفئات</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_ar}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد دورات متاحة</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح جميع الفئات</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        course.level === 'beginner' ? 'from-green-400 to-emerald-500' :
                        course.level === 'intermediate' ? 'from-blue-400 to-indigo-500' :
                        'from-purple-400 to-pink-500'
                      }`}></div>
                      
                      <div className="absolute inset-0 bg-black/20"></div>
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${
                          course.level === 'beginner' ? 'bg-green-500/80' :
                          course.level === 'intermediate' ? 'bg-blue-500/80' :
                          'bg-purple-500/80'
                        }`}>
                          {course.level === 'beginner' ? 'مبتدئ' :
                           course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                        </div>
                      </div>

                      {/* Price Badge */}
                      {course.price === 0 ? (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            مجاني
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            ${course.price}
                          </div>
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl"
                        >
                          <Play className="w-6 h-6 text-blue-600" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {course.title_ar}
                        </h3>
                        {course.is_featured && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-1 rounded-lg">
                            <Award className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors">
                        {course.description_ar}
                      </p>

                      {/* Course Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{course.duration_hours}h</span>
                          </div>
                          <div className="text-xs text-gray-500">المدة</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm font-medium">{course.total_lessons}</span>
                          </div>
                          <div className="text-xs text-gray-500">دروس</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">{course.total_students || 0}</span>
                          </div>
                          <div className="text-xs text-gray-500">طلاب</div>
                        </div>
                      </div>

                      {/* Rating */}
                      {course.avg_rating && (
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(course.avg_rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {course.avg_rating} ({course.total_reviews || 0} تقييم)
                          </span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <a
                          href={`/courses/${course.slug}`}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                          {course.price === 0 ? 'ابدأ الدورة مجاناً' : 'عرض التفاصيل'}
                          <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </motion.div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
