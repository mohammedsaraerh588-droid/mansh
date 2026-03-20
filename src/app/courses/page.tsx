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
    // Avoids Next.js prerender/Suspense requirements for useSearchParams().
    const sp = new URLSearchParams(window.location.search)
    const q = sp.get('q') || ''
    const c = sp.get('cat') || 'all'
    setSearch(q)
    setCat(c)
  }, [])

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name_ar')
      if (cats) setCategories(cats)

      // نعرض كل الدورات المنشورة + المسودات حتى تظهر للطلاب
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
    const matchCat = cat === 'all' || String(c.category_id) === String(cat)
    return matchSearch && matchCat
  })

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:32,paddingBottom:60}}>
      <div className="wrap">

        {/* Hero header */}
        <div className="hero" style={{borderRadius:16,padding:'40px 32px',marginBottom:28,textAlign:'center',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(13,148,136,.2),transparent 70%)',top:'-20%',right:'-5%',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div className="eyebrow" style={{background:'rgba(20,184,166,.15)',borderColor:'rgba(20,184,166,.3)',color:'#99f6e4'}}>
              <Stethoscope size={11}/>الدورات الطبية
            </div>
            <h1 style={{fontSize:'clamp(22px,3.5vw,38px)',fontWeight:900,color:'#fff',marginBottom:8,lineHeight:1.2}}>
              استكشف الدورات المتاحة
            </h1>
            <p style={{color:'rgba(255,255,255,.55)',marginBottom:28,fontSize:15}}>
              دورات طبية متخصصة في مختلف التخصصات
            </p>
            {/* Search + filter */}
            <div style={{maxWidth:620,margin:'0 auto',display:'flex',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:200,position:'relative'}}>
                <span style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.4)',display:'flex',pointerEvents:'none'}}>
                  <Search size={15}/>
                </span>
                <input
                  style={{width:'100%',padding:'11px 44px 11px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.08)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
                  placeholder="ابحث عن دورة..."
                  value={search}
                  onChange={e=>setSearch(e.target.value)}/>
              </div>
              <div style={{width:190,position:'relative'}}>
                <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.4)',display:'flex',pointerEvents:'none'}}>
                  <SlidersHorizontal size={13}/>
                </span>
                <select
                  style={{width:'100%',padding:'11px 38px 11px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.08)',color:'#fff',fontSize:13,outline:'none',cursor:'pointer',fontFamily:'inherit',appearance:'none'}}
                  value={cat}
                  onChange={e=>setCat(e.target.value)}>
                  <option value="all" style={{background:'#0a1628'}}>جميع التخصصات</option>
                  {categories.map(c=>(
                    <option key={c.id} value={c.id} style={{background:'#0a1628'}}>{c.name_ar}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
            <Loader2 size={32} className="spin" style={{color:'var(--teal)'}}/>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p style={{fontSize:13,fontWeight:600,color:'var(--txt3)',marginBottom:18}}>
              {filtered.length} دورة متاحة
            </p>
            <div className="courses-grid">
              {filtered.map(c => <CourseCard key={c.id} course={c}/>)}
            </div>
          </>
        ) : (
          <div className="card" style={{padding:60,textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:16,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <BookOpen size={26} style={{color:'var(--teal)'}}/>
            </div>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>
              {search || cat!=='all' ? 'لا توجد نتائج مطابقة' : 'لا توجد دورات بعد'}
            </h3>
            <p style={{color:'var(--txt2)',fontSize:14}}>
              {search || cat!=='all'
                ? 'جرّب تغيير كلمات البحث أو التصنيف'
                : 'لم يتم إضافة أي دورات حتى الآن'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
