'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { AlertCircle, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [form, setForm] = useState({
    title:'', description:'', categoryId:'',
    level:'beginner', price:'0',
  })
  const [errs, setErrs] = useState<any>({})

  useEffect(() => {
    supabase.from('categories').select('*').order('name_ar')
      .then(({ data }) => { if (data) setCategories(data); setLoading(false) })
  }, [])

  const validate = () => {
    const e: any = {}
    if (form.title.trim().length < 5)   e.title       = 'العنوان 5 أحرف على الأقل'
    if (form.description.trim().length < 20) e.description = 'الوصف 20 حرف على الأقل'
    if (!form.categoryId)                e.categoryId  = 'اختر تصنيفاً'
    if (isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'سعر غير صحيح'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true); setError('')
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    const slug = slugify(form.title) + '-' + Math.random().toString(36).substring(2,6)
    const { data: course, error: err } = await supabase.from('courses').insert({
      teacher_id: session.user.id,
      title: form.title.trim(),
      title_ar: form.title.trim(),
      slug, category_id: form.categoryId,
      level: form.level, price: Number(form.price),
      description: form.description.trim(),
      short_description: form.description.trim().substring(0,200),
      status: 'published',
    }).select().single()
    setSubmitting(false)
    if (err) { setError(err.message); return }
    router.push(`/dashboard/teacher/courses/${course.id}`)
  }

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  return (
    <div style={{maxWidth:680,margin:'0 auto',display:'flex',flexDirection:'column',gap:22}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
        <Link href="/dashboard/teacher/courses">
          <button className="btn btn-outline btn-sm" style={{padding:'8px'}}><ArrowRight size={16}/></button>
        </Link>
        <div>
          <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>إنشاء دورة جديدة</h1>
          <p style={{fontSize:13,color:'var(--txt2)',marginTop:2}}>أدخل المعلومات الأساسية، يمكنك تعديل كل شيء لاحقاً.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:20}}>
        {error && (
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)'}}>
            <AlertCircle size={15} style={{color:'var(--err)',flexShrink:0}}/>
            <span style={{fontSize:13,color:'var(--err)'}}>{error}</span>
          </div>
        )}

        <div className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>معلومات الدورة</h3>

          <Input label="عنوان الدورة *" placeholder="مثال: مقدمة في علم التشريح"
            value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
            error={errs.title}/>

          <div>
            <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>الوصف *</label>
            <textarea className="inp" style={{minHeight:100,resize:'vertical'}}
              placeholder="اكتب وصفاً شاملاً عن الدورة والمهارات التي سيتعلمها الطالب..."
              value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            {errs.description && <p style={{marginTop:4,fontSize:12,color:'var(--err)'}}>{errs.description}</p>}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>التصنيف *</label>
              <select className="inp" value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}>
                <option value="">اختر التصنيف</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
              {errs.categoryId && <p style={{marginTop:4,fontSize:12,color:'var(--err)'}}>{errs.categoryId}</p>}
            </div>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>المستوى *</label>
              <select className="inp" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
                <option value="all">جميع المستويات</option>
              </select>
            </div>
          </div>

          <div style={{maxWidth:240}}>
            <Input label="سعر الدورة (USD)" type="number" step="0.01" placeholder="0"
              value={form.price} onChange={e=>setForm({...form,price:e.target.value})}
              error={errs.price} helperText="ضع 0 لجعل الدورة مجانية"/>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          <Link href="/dashboard/teacher/courses">
            <button type="button" className="btn btn-outline btn-lg" style={{textDecoration:'none'}}>إلغاء</button>
          </Link>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
            {submitting ? <><Loader2 size={16} className="spin"/>جاري الحفظ...</> : <><BookOpen size={16}/>إنشاء الدورة</>}
          </button>
        </div>
      </form>
    </div>
  )
}
