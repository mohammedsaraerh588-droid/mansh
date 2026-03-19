'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Search, Loader2, BookOpen, SlidersHorizontal, Stethoscope } from 'lucide-react'

export default function CoursesPage() {
  const [courses,    setCourses]    = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [cat,        setCat]        = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)

      const { data: crs, error } = await supabase
        .from('courses')
        .select('*, category:categories(id,name,name_ar), teacher:profiles(full_name)')
        .in('status', ['published', 'draft'])
        .order('created_at', { ascending: false })

      if (error) console.error('[COURSES]', error)
      if (crs) setCourses(crs)
      setLoading(false)
    })()
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'all' || c.category_id === cat
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="wrap">

        {/* Header Section */}
        <div className="relative mb-12 p-10 md:p-16 rounded-[2.5rem] bg-navy overflow-hidden shadow-2xl border border-white/5">
          {/* Decorative Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-mint/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                <Stethoscope size={14} className="text-mint" />
                <span className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">المسارات التعليمية</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              استكشف آفاقك <span className="text-mint italic font-serif">الطبية</span>
            </h1>
            <p className="text-white/40 text-lg mb-10 leading-relaxed font-medium">
              اختر تخصصك وابدأ رحلتك التعليمية مع أفضل المحاضرين والخبراء في المجال الصحي.
            </p>

            {/* Premium Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-mint transition-colors" />
                <input 
                  type="text"
                  placeholder="ابحث عن دورة..."
                  className="w-full h-14 pr-12 pl-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-mint/50 focus:bg-white/10 transition-all font-bold text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-56 group">
                <SlidersHorizontal size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-mint transition-colors" />
                <select 
                  className="w-full h-14 pr-12 pl-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-mint/50 focus:bg-white/10 transition-all font-bold text-sm appearance-none cursor-pointer"
                  value={cat}
                  onChange={e => setCat(e.target.value)}
                >
                  <option value="all" className="bg-navy">جميع التخصصات</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-navy">{c.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-lg font-black text-navy flex items-center gap-2">
                <div className="w-1.5 h-6 bg-mint rounded-full" />
                نتائج البحث
            </h2>
            <span className="text-xs font-bold text-txt3 bg-white px-3 py-1 rounded-full border border-border shadow-sm">
                تم العثور على {filtered.length} دورة
            </span>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <Loader2 size={48} className="spin text-navy" />
            <span className="mt-4 font-bold text-sm uppercase tracking-widest text-navy">جاري التحميل...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="courses-grid gap-y-10">
            {filtered.map(c => <CourseCard key={c.id} course={c}/>)}
          </div>
        ) : (
          <div className="card text-center py-24 px-10 max-w-lg mx-auto rounded-[3rem] border-dashed border-2">
             <div className="w-20 h-20 rounded-3xl bg-bg2 flex items-center justify-center mx-auto mb-8">
                <BookOpen size={40} className="text-navy/20" />
             </div>
             <h3 className="text-xl font-black text-navy mb-4">
                {search || cat !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا توجد دورات متاحة'}
             </h3>
             <p className="text-txt2 text-sm leading-relaxed mb-10">
                {search || cat !== 'all' 
                  ? 'جرّب تغيير كلمات البحث أو اختيار تخصص آخر لاستكشاف المزيد.' 
                  : 'كن أول من يعرف عند إطلاق دورات جديدة. ترقبونا قريباً!'}
             </p>
             {(search || cat !== 'all') && (
                <button 
                  onClick={() => { setSearch(''); setCat('all') }}
                  className="btn btn-primary px-8"
                >
                    إعادة ضبط الفلاتر
                </button>
             )}
          </div>
        )}
      </div>
    </div>
  )
}

