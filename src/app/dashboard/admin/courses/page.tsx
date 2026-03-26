'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Loader2, BookOpen } from 'lucide-react'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [filter,  setFilter]  = useState<'pending'|'published'|'all'>('pending')
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => { loadCourses() }, [filter])

  const loadCourses = async () => {
    setLoading(true)
    let q = supabase.from('courses')
      .select('id,title,status,price,currency,created_at,total_students,teacher:profiles(full_name),category:categories(name_ar)')
      .order('created_at',{ascending:false})
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setCourses(data||[]); setLoading(false)
  }

  const setStatus = async (id:string, status:string) => {
    await supabase.from('courses').update({status}).eq('id',id)
    setCourses(p=>p.map(c=>c.id===id?{...c,status}:c))
  }

  const statusBadge = (s:string) => ({published:'badge-green',draft:'badge-gray',pending:'badge-yellow',archived:'badge-dark'}[s]||'badge-gray')
  const statusLabel = (s:string) => ({published:'منشور',draft:'مسودة',pending:'قيد المراجعة',archived:'مؤرشف'}[s]||s)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>الإدارة</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>إدارة الدورات</h1>
      </div>

      {/* Filter tabs */}
      <div style={{display:'flex',gap:8}}>
        {([['pending','قيد المراجعة'],['published','منشورة'],['all','الكل']] as const).map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className={filter===v?'btn-register btn-sm':'btn btn-outline btn-sm'}
            style={{padding:'7px 16px',fontSize:13}}>
            {l}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{display:'flex',justifyContent:'center',padding:'48px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--alpha-green)'}}/></div>
        : courses.length === 0
          ? <div className="card" style={{padding:48,textAlign:'center'}}>
              <BookOpen size={32} style={{color:'var(--tx4)',margin:'0 auto 12px'}}/>
              <p style={{color:'var(--tx3)',fontSize:14}}>لا توجد دورات في هذه الحالة</p>
            </div>
          : <div className="card" style={{overflow:'hidden'}}>
              <table className="tbl">
                <thead>
                  <tr><th>الدورة</th><th>المعلم</th><th>التصنيف</th><th>السعر</th><th>الطلاب</th><th>الحالة</th><th>الإجراءات</th></tr>
                </thead>
                <tbody>
                  {courses.map(c=>(
                    <tr key={c.id}>
                      <td style={{fontWeight:600,color:'var(--tx1)',maxWidth:200}}>
                        <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div>
                        <div style={{fontSize:11,color:'var(--tx4)'}}>{new Date(c.created_at).toLocaleDateString('ar-SA')}</div>
                      </td>
                      <td style={{fontSize:13,color:'var(--tx2)'}}>{c.teacher?.full_name||'—'}</td>
                      <td style={{fontSize:12,color:'var(--tx3)'}}>{c.category?.name_ar||'—'}</td>
                      <td style={{fontWeight:700,color:c.price===0?'var(--ok)':'var(--tx1)'}}>{c.price===0?'مجاني':`${c.price}$`}</td>
                      <td>{c.total_students||0}</td>
                      <td><span className={`badge ${statusBadge(c.status)}`}>{statusLabel(c.status)}</span></td>
                      <td>
                        <div style={{display:'flex',gap:6}}>
                          {c.status==='pending' && (<>
                            <button onClick={()=>setStatus(c.id,'published')} className="btn btn-sm" style={{background:'var(--ok-bg)',color:'var(--ok)',border:'1px solid var(--ok-brd)'}}>
                              <CheckCircle size={12}/>موافقة
                            </button>
                            <button onClick={()=>setStatus(c.id,'archived')} className="btn btn-danger btn-sm">
                              <XCircle size={12}/>رفض
                            </button>
                          </>)}
                          {c.status==='published' && (
                            <button onClick={()=>setStatus(c.id,'archived')} className="btn btn-danger btn-sm">
                              <XCircle size={12}/>إيقاف
                            </button>
                          )}
                          {c.status==='archived' && (
                            <button onClick={()=>setStatus(c.id,'published')} className="btn btn-sm" style={{background:'var(--ok-bg)',color:'var(--ok)',border:'1px solid var(--ok-brd)'}}>
                              <CheckCircle size={12}/>إعادة نشر
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
    </div>
  )
}
