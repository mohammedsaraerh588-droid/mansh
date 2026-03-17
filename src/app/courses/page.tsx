'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Search, Loader2, BookOpen, SlidersHorizontal } from 'lucide-react'
import type { Course, Category } from '@/types'

export default function CoursesPage() {
  const [courses,    setCourses]    = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [cat,        setCat]        = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)
      const { data: crs } = await supabase.from('courses')
        .select('*, category:categories(id,name,name_ar)')
        .eq('status','published').order('created_at',{ascending:false})
      if (crs) setCourses(crs as any)
      setLoading(false)
    })()
  }, [])

  const filtered = courses.filter(c =>
    (c.title.includes(search) || c.title_ar?.includes(search) || !search) &&
    (cat==='all' || c.category_id===cat)
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',padding:'32px 0'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px'}}>

        {/* Header */}
        <div className="card" style={{padding:'44px 32px',marginBottom:28,textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(150deg,#0e0e1a,#1e1e38)',opacity:.04}}/>
          <div style={{position:'relative',zIndex:1}}>
            <p className="sec-eyebrow">مكتبة الدورات</p>
            <h1 className="sec-title" style={{marginBottom:6}}>استكشف الدورات المتاحة</h1>
            <div className="gold-bar"/>
            <p style={{color:'var(--txt2)',marginBottom:28,marginTop:12,fontSize:15}}>مئات الدورات في مختلف المجالات مع أفضل المعلمين العرب.</p>
            <div style={{maxWidth:640,margin:'0 auto',display:'flex',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:220,position:'relative'}}>
                <span style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',display:'flex'}}>
                  <Search size={16}/>
                </span>
                <input className="inp" style={{paddingRight:40}} placeholder="ابحث عن دورة..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              <div style={{width:200,position:'relative'}}>
                <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',display:'flex',pointerEvents:'none'}}>
                  <SlidersHorizontal size={14}/>
                </span>
                <select className="inp" style={{paddingRight:36,cursor:'pointer',appearance:'none'}} value={cat} onChange={e=>setCat(e.target.value)}>
                  <option value="all">جميع التصنيفات</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name_ar}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
            <Loader2 size={36} className="spin" style={{color:'var(--gold)'}}/>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p style={{fontSize:13,fontWeight:600,color:'var(--txt3)',marginBottom:18}}>{filtered.length} دورة متاحة</p>
            <div className="courses-grid">
              {filtered.map(c=><CourseCard key={c.id} course={c}/>)}
            </div>
          </>
        ) : (
          <div className="card" style={{padding:64,textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:16,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <BookOpen size={26} style={{color:'var(--txt3)'}}/>
            </div>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد نتائج</h3>
            <p style={{color:'var(--txt2)',fontSize:14}}>جرب كلمات مفتاحية أخرى أو تصنيفاً مختلفاً.</p>
          </div>
        )}
      </div>
    </div>
  )
}
