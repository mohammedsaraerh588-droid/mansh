'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, BookOpen, Settings, Users, Eye, Loader2, CheckCircle } from 'lucide-react'

export default function ManageCoursePage() {
  const { id }   = useParams()
  const router   = useRouter()
  const [course, setCourse]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data, error } = await supabase
        .from('courses').select('*,categories(name_ar)')
        .eq('id',id).eq('teacher_id',session.user.id).single()
      if (error || !data) { router.push('/dashboard/teacher/courses'); return }
      setCourse(data); setLoading(false)
    })()
  }, [id])

  const handlePublish = async () => {
    setPublishing(true)
    await supabase.from('courses').update({ status:'pending' }).eq('id', id)
    setCourse((p:any) => ({...p, status:'pending'}))
    setPublishing(false)
  }

  const statusLabel = (s:string) => s==='published'?'منشور':s==='pending'?'قيد المراجعة':s==='draft'?'مسودة':'مؤرشف'
  const statusClass = (s:string) => s==='published'?'badge-green':s==='pending'?'badge-yellow':'badge-gray'

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:14,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
        <Link href="/dashboard/teacher/courses">
          <button className="btn btn-outline btn-sm" style={{padding:'8px',marginTop:3}}><ArrowRight size={16}/></button>
        </Link>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>{course.title}</h1>
            <span className={`badge ${statusClass(course.status)}`}>{statusLabel(course.status)}</span>
          </div>
          <p style={{fontSize:13,color:'var(--txt2)',marginTop:3}}>إدارة محتوى وتفاصيل الدورة</p>
        </div>
        {course.status==='published' && (
          <Link href={`/courses/${course.slug}`} target="_blank" className="btn btn-outline btn-md" style={{textDecoration:'none'}}>
            <Eye size={15}/>معاينة
          </Link>
        )}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20,alignItems:'start'}}>
        {/* Actions */}
        <div className="card" style={{padding:22}}>
          <h2 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',marginBottom:16,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
            خيارات الإدارة
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {[
              { href:`/dashboard/teacher/courses/${id}/curriculum`, Icon:BookOpen, t:'المنهج والدروس',    d:'أضف وتنظيم الفصول والدروس والفيديوهات' },
              { href:`/dashboard/teacher/courses/${id}/edit`,       Icon:Settings, t:'تعديل تفاصيل الدورة', d:'عدّل العنوان والوصف والسعر والصورة'      },
            ].map(({href,Icon,t,d})=>(
              <Link key={href} href={href} style={{textDecoration:'none'}}>
                <div className="card card-hover" style={{padding:'20px 18px',textAlign:'center',cursor:'pointer'}}>
                  <div style={{width:50,height:50,borderRadius:13,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                    <Icon size={22} style={{color:'var(--teal)'}}/>
                  </div>
                  <div style={{fontWeight:800,fontSize:14,color:'var(--txt1)',marginBottom:5}}>{t}</div>
                  <div style={{fontSize:12,color:'var(--txt2)',lineHeight:1.5}}>{d}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick info */}
        <div className="card" style={{padding:22,display:'flex',flexDirection:'column',gap:14}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>نظرة سريعة</h3>
          {[
            { l:'التصنيف',        v: course.categories?.name_ar || '—' },
            { l:'الطلاب',         v: <span style={{display:'flex',alignItems:'center',gap:5}}><Users size={12}/>{course.total_students||0}</span> },
            { l:'السعر',          v: <span style={{color:'var(--teal)',fontWeight:700}}>{formatPrice(course.price,course.currency)}</span> },
            { l:'إجمالي الدروس',  v: `${course.total_lessons||0} درس` },
          ].map(({l,v},i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}>
              <span style={{color:'var(--txt2)'}}>{l}</span>
              <span style={{fontWeight:700,color:'var(--txt1)'}}>{v as any}</span>
            </div>
          ))}

          {course.status==='draft' && (
            <div style={{paddingTop:12,borderTop:'1px solid var(--border)'}}>
              <button onClick={handlePublish} disabled={publishing} className="btn btn-primary btn-md btn-full">
                {publishing ? <><Loader2 size={14} className="spin"/>جاري الإرسال...</> : <><CheckCircle size={14}/>طلب المراجعة والنشر</>}
              </button>
              <p style={{fontSize:11,color:'var(--txt3)',textAlign:'center',marginTop:6}}>تأكد من إضافة محتوى قبل الإرسال</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
