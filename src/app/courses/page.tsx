'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Course, Category } from '@/types'
import CourseCard from '@/components/courses/CourseCard'
import { Search, Loader2, BookOpen, SlidersHorizontal } from 'lucide-react'

export default function CoursesPage() {
  const [courses, setCourses]       = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)
      const { data: crs } = await supabase
        .from('courses').select('*, category:categories(id,name,name_ar)')
        .eq('status','published').order('created_at',{ascending:false})
      if (crs) setCourses(crs as any[])
      setLoading(false)
    }
    fetchCourses()
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.includes(search) || c.title_ar?.includes(search) || false
    const matchCat    = category === 'all' || c.category_id === category
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen py-10" style={{background:'var(--surface)'}}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="glass-card p-10 mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{background:'var(--gradient-hero)'}} />
          <div className="relative z-10">
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{color:'var(--gold)',letterSpacing:'0.15em'}}>مكتبة الدورات</p>
            <h1 className="text-4xl font-black mb-3" style={{color:'var(--text-primary)'}}>استكشف الدورات المتاحة</h1>
            <div className="gold-separator mb-5" />
            <p className="mb-8 max-w-xl mx-auto" style={{color:'var(--text-secondary)'}}>مئات الدورات في مختلف المجالات لتطوير مهاراتك مع أفضل المعلمين.</p>

            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{color:'var(--text-muted)'}} />
                <input
                  placeholder="ابحث عن دورة..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input-field pr-10 w-full"
                />
              </div>
              <div className="sm:w-56 relative">
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{color:'var(--text-muted)'}} />
                <select
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="input-field appearance-none pr-10 w-full cursor-pointer"
                >
                  <option value="all">جميع التصنيفات</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin" style={{color:'var(--gold)'}} />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm font-bold mb-6" style={{color:'var(--text-secondary)'}}>
              {filtered.length} دورة متاحة
            </p>
            <div className="courses-grid">
              {filtered.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </>
        ) : (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--surface-3)'}}>
              <BookOpen className="w-8 h-8" style={{color:'var(--text-muted)'}} />
            </div>
            <h3 className="text-xl font-black mb-2" style={{color:'var(--text-primary)'}}>لا توجد نتائج</h3>
            <p style={{color:'var(--text-secondary)'}}>لم نجد دورات مطابقة. جرب كلمات مفتاحية أخرى.</p>
          </div>
        )}
      </div>
    </div>
  )
}
