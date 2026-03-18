'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { ArrowRight, Save, Loader2, CheckCircle, AlertCircle, Upload, X } from 'lucide-react'

export default function EditCoursePage() {
  const { id }   = useParams()
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [msg,        setMsg]        = useState<{type:'ok'|'err',text:string}|null>(null)
  const [uploadingThumb, setUploadingThumb] = useState(false)

  const [form, setForm] = useState({
    title:'', description:'', short_description:'',
    categoryId:'', level:'beginner', price:'0',
    thumbnail_url:'', what_you_learn:[''], requirements:[''],
  })

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const [{ data:cats }, { data:course, error }] = await Promise.all([
        supabase.from('categories').select('*').order('name_ar'),
        supabase.from('courses').select('*').eq('id',id).eq('teacher_id',session.user.id).single(),
      ])
      if (cats) setCategories(cats)
      if (error || !course) { router.push('/dashboard/teacher/courses'); return }
      setForm({
        title: course.title||'',
        description: course.description||'',
        short_description: course.short_description||'',
        categoryId: course.category_id||'',
        level: course.level||'beginner',
        price: String(course.price||0),
        thumbnail_url: course.thumbnail_url||'',
        what_you_learn: course.what_you_learn?.length ? course.what_you_learn : [''],
        requirements:   course.requirements?.length   ? course.requirements   : [''],
      })
      setLoading(false)
    })()
  }, [id])

  const showMsg = (type:'ok'|'err', text:string) => {
    setMsg({type,text}); setTimeout(()=>setMsg(null),3500)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('courses').update({
      title: form.title, description: form.description,
      short_description: form.short_description || form.description.substring(0,200),
      category_id: form.categoryId, level: form.level,
      price: Number(form.price), thumbnail_url: form.thumbnail_url,
      what_you_learn: form.what_you_learn.filter(x=>x.trim()),
      requirements:   form.requirements.filter(x=>x.trim()),
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    setSaving(false)
    showMsg(error ? 'err' : 'ok', error ? `فشل الحفظ: ${error.message}` : 'تم حفظ التغييرات بنجاح')
  }

  /* upload thumbnail */
  const handleThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingThumb(true)
    try {
      const res  = await fetch('/api/upload-signature', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({resource_type:'image'}) })
      const { signature,timestamp,folder,cloudName,apiKey } = await res.json()
      const fd = new FormData()
      fd.append('file', file); fd.append('signature', signature)
      fd.append('timestamp', String(timestamp)); fd.append('api_key', apiKey)
      fd.append('folder', folder)
      const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{method:'POST',body:fd})
      const data = await up.json()
      if (up.ok) setForm(p=>({...p,thumbnail_url:data.secure_url}))
      else throw new Error(data.error?.message)
    } catch(err:any) { showMsg('err', err.message||'فشل رفع الصورة') }
    setUploadingThumb(false)
  }

  /* list helpers */
  const addItem    = (field:'what_you_learn'|'requirements') =>
    setForm(p=>({...p,[field]:[...p[field],'']}))
  const removeItem = (field:'what_you_learn'|'requirements', i:number) =>
    setForm(p=>({...p,[field]:p[field].filter((_:any,idx:number)=>idx!==i)}))
  const editItem   = (field:'what_you_learn'|'requirements', i:number, v:string) =>
    setForm(p=>({...p,[field]:p[field].map((x:string,idx:number)=>idx===i?v:x)}))

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  return (
    <div style={{maxWidth:760,margin:'0 auto',display:'flex',flexDirection:'column',gap:22}}>
      <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
        <Link href={`/dashboard/teacher/courses/${id}`}>
          <button className="btn btn-outline btn-sm" style={{padding:'8px'}}><ArrowRight size={16}/></button>
        </Link>
        <div>
          <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>تعديل تفاصيل الدورة</h1>
          <p style={{fontSize:13,color:'var(--txt2)',marginTop:2}}>عدّل معلومات الدورة، الصورة، والمحتوى التعريفي.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>

        {/* Basic Info */}
        <div className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>المعلومات الأساسية</h3>
          <Input label="عنوان الدورة *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>الوصف الكامل *</label>
            <textarea className="inp" style={{minHeight:100,resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/>
          </div>
          <div>
            <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>الوصف المختصر</label>
            <textarea className="inp" style={{minHeight:68,resize:'vertical'}} placeholder="وصف قصير يظهر في بطاقة الدورة..." value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>التصنيف *</label>
              <select className="inp" value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} required>
                <option value="">اختر التصنيف</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>المستوى</label>
              <select className="inp" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
                <option value="all">جميع المستويات</option>
              </select>
            </div>
            <Input label="السعر (USD)" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} helperText="0 = مجاني"/>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:14}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>صورة الدورة</h3>
          <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
            {form.thumbnail_url ? (
              <div style={{position:'relative',flexShrink:0}}>
                <img src={form.thumbnail_url} alt="" style={{width:180,height:110,objectFit:'cover',borderRadius:10,border:'1px solid var(--border)'}}/>
                <button type="button" onClick={()=>setForm(p=>({...p,thumbnail_url:''}))}
                  style={{position:'absolute',top:-8,left:-8,width:22,height:22,borderRadius:'50%',background:'var(--err)',border:'none',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <X size={12}/>
                </button>
              </div>
            ) : (
              <div style={{width:180,height:110,borderRadius:10,border:'2px dashed var(--border2)',background:'var(--bg2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span style={{fontSize:12,color:'var(--txt3)'}}>لا توجد صورة</span>
              </div>
            )}
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
              <label style={{display:'inline-flex',alignItems:'center',gap:7,cursor:'pointer',padding:'9px 18px',borderRadius:9,border:'1.5px solid var(--border2)',fontSize:13,fontWeight:700,color:'var(--txt1)',background:'var(--surface)',transition:'all .15s',width:'fit-content'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border2)';(e.currentTarget as HTMLElement).style.color='var(--txt1)'}}>
                {uploadingThumb ? <Loader2 size={14} className="spin"/> : <Upload size={14}/>}
                {uploadingThumb ? 'جاري الرفع...' : 'رفع صورة جديدة'}
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} disabled={uploadingThumb}/>
              </label>
              <p style={{fontSize:12,color:'var(--txt3)'}}>أو أدخل رابط الصورة مباشرة:</p>
              <input className="inp" placeholder="https://example.com/image.jpg" value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})} dir="ltr"/>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        {(['what_you_learn','requirements'] as const).map(field=>(
          <div key={field} className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:12}}>
            <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
              {field==='what_you_learn' ? 'ماذا سيتعلم الطالب' : 'متطلبات الدورة'}
            </h3>
            {form[field].map((item:string,i:number)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'center'}}>
                <input className="inp" style={{flex:1}} placeholder={field==='what_you_learn'?`مهارة ${i+1}...`:`متطلب ${i+1}...`}
                  value={item} onChange={e=>editItem(field,i,e.target.value)}/>
                <button type="button" onClick={()=>removeItem(field,i)}
                  style={{width:34,height:34,borderRadius:8,border:'1px solid var(--border2)',background:'var(--bg2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--err-bg)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='var(--bg2)')}>
                  <X size={14} style={{color:'var(--err)'}}/>
                </button>
              </div>
            ))}
            <button type="button" onClick={()=>addItem(field)} className="btn btn-outline btn-sm" style={{alignSelf:'flex-start'}}>
              + إضافة عنصر
            </button>
          </div>
        ))}

        {/* Footer */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:4}}>
          <div>
            {msg && (
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',borderRadius:9,background:msg.type==='ok'?'var(--ok-bg)':'var(--err-bg)',border:`1px solid ${msg.type==='ok'?'rgba(5,150,105,.15)':'rgba(220,38,38,.15)'}`}}>
                {msg.type==='ok'?<CheckCircle size={15} style={{color:'var(--ok)'}}/>:<AlertCircle size={15} style={{color:'var(--err)'}}/>}
                <span style={{fontSize:13,fontWeight:700,color:msg.type==='ok'?'var(--ok)':'var(--err)'}}>{msg.text}</span>
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            {saving?<><Loader2 size={16} className="spin"/>جاري الحفظ...</>:<><Save size={16}/>حفظ التغييرات</>}
          </button>
        </div>
      </form>
    </div>
  )
}
