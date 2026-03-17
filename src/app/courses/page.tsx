'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Course, Category } from '@/types'
import CourseCard from '@/components/courses/CourseCard'
import { Input } from '@/components/ui/Input'
import { Search, Loader2, Filter, BookOpen } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCourses = async () => {
      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)

      // Fetch published courses with category
      const { data: crs } = await supabase
        .from('courses')
        .select(`
          *,
          category:categories(id, name, name_ar)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      
      if (crs) setCourses(crs as any[])
      setLoading(false)
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.includes(searchQuery) || course.title_ar?.includes(searchQuery) || false
    const matchesCategory = selectedCategory === 'all' || course.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Header & Search */}
        <div className="glass-card p-8 mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <h1 className="text-4xl font-black mb-4">استكشف الدورات المتاحة</h1>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            مئات الدورات في مختلف المجالات لتطوير مهاراتك من الصفر وحتى الاحتراف مع أفضل الخبراء.
          </p>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="ابحث عن دورة (مثال: برمجة تطبيقات)..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="sm:w-64 relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                <Filter className="w-5 h-5" />
              </div>
              <select
                className="input-field appearance-none pr-10 bg-white/5 border-white/10 text-white w-full cursor-pointer h-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all" className="bg-surface">جميع التصنيفات</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-surface">{cat.name_ar}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">لا توجد نتائج</h3>
            <p className="text-text-secondary">لم نعثر على دورات مطابقة لبحثك. جرب كلمات مفتاحية أخرى.</p>
          </div>
        )}
      </div>
    </div>
  )
}
