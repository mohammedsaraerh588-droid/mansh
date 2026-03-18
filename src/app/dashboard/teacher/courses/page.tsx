'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { PlusCircle, Search, Video, Users, Star, Loader2, Trash2 } from 'lucide-react'

export default function TeacherCoursesPage() {
  const [courses,  setCourses]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string|null>(null)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('courses')
        .select('id,title,status,total_students,price,currency,avg_rating,created_at,category:categories(name_ar)')
        .eq('teacher_id',session.user.id).order('created_at',{ascending:false})
      if (data) setCourses(data)
      setLoading(false)
    })()
  },[])

  const deleteCourse = async (id:string, title:string) => {
    if (!confirm(`هل أنت متأكد من حذف دورة "${title}"؟\nسيتم حذف جميع الدروس والفصول المرتبطة بها.`)) return
    setDeleting(id)
    await supabase.from('courses').delete().eq('id', id)
    setCourses(p => p.filter(c => c.id !== id))
    setDeleting(null)
  }

  const filtered    = courses.filter(c=>c.title?.toLowerCase().includes(search.toLowerCase()))
  const statusLabel = (s:string) => s==='published'?'منشور':s==='pending'?'قيد المراجعة':'مسودة'
  const statusBadge = (s:string) => s==='published'?'badge-green':s==='pending'?'badge-yellow':'badge-gray'

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:14}}>
        <div>
          <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--teal)',marginBottom:5}}>المحتوى</p>
          <h1 style={{fontSize:24,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>إدارة الدورات</h1>
          <p style={{fontSize:14,color:'var(--txt2)'}}>{courses.length} دورة</p>
        </div>
        <Link href="/dashboard/teacher/courses/new" className="btn btn-primary btn-md" style={{textDecoration:'none',display:'inline-flex'}}>
          <PlusCircle size={16}/>دورة جديدة
        </Link>
      </div>

      {/* Search */}
      <div style={{position:'relative'}}>
        <span style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',display:'flex'}}><Search size={15}/></span>
        <input className="inp" style={{paddingRight:40}} placeholder="ابحث عن دورة..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* Grid */}
      {filtered.length===0 ? (
        <div className="card" style={{padding:56,textAlign:'center',border:'2px dashed var(--border)'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <Video size={26} style={{color:'var(--txt3)'}}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد دورات</h3>
          <p style={{fontSize:14,color:'var(--txt2)',marginBottom:20}}>ابدأ بإنشاء دورتك الأولى الآن.</p>
          <Link href="/dashboard/teacher/courses/new" className="btn btn-primary btn-md" style={{textDecoration:'none',display:'inline-flex'}}>إنشاء دورة</Link>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
          {filtered.map(c=>(
            <div key={c.id} className="card" style={{display:'flex',flexDirection:'column',overflow:'hidden',transition:'all .2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='var(--s2)';(e.currentTarget as HTMLElement).style.borderColor='var(--teal2)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='var(--s1)';(e.currentTarget as HTMLElement).style.borderColor='var(--border)'}}>
              <div style={{padding:'18px 18px 14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <span className={`badge ${statusBadge(c.status)}`}>{statusLabel(c.status)}</span>
                  <span style={{fontSize:11,color:'var(--txt3)'}}>{c.category?.name_ar||'بدون تصنيف'}</span>
                </div>
                <h3 style={{fontWeight:800,fontSize:15,marginBottom:12,color:'var(--txt1)',lineHeight:1.4}}>{c.title}</h3>
                <div style={{display:'flex',gap:14,fontSize:13,color:'var(--txt2)'}}>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Users size={13} style={{color:'var(--teal)'}}/>{c.total_students||0}</span>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><Star size={13} style={{fill:'#f59e0b',color:'#f59e0b'}}/>{c.avg_rating>0?c.avg_rating.toFixed(1):'جديد'}</span>
                </div>
              </div>
              <div style={{padding:'12px 18px',background:'var(--bg2)',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto',gap:8}}>
                <span style={{fontWeight:900,fontSize:15,color:'var(--teal)'}}>{formatPrice(c.price,c.currency)}</span>
                <div style={{display:'flex',gap:8}}>
                  <Link href={`/dashboard/teacher/courses/${c.id}`} className="btn btn-outline btn-sm" style={{textDecoration:'none'}}>تعديل</Link>
                  <button onClick={()=>deleteCourse(c.id,c.title)} disabled={deleting===c.id}
                    className="btn btn-sm btn-danger" title="حذف الدورة">
                    {deleting===c.id ? <Loader2 size={13} className="spin"/> : <Trash2 size={13}/>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
