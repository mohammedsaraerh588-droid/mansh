'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { ArrowRight, Save, Loader2, Video, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import VideoUploader from '@/components/ui/VideoUploader'

export default function LessonEditorPage() {
  const { id, lessonId } = useParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [lesson,  setLesson]  = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState<{type:'ok'|'err', text:string}|null>(null)

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: course } = await supabase.from('courses').select('id,teacher_id').eq('id',id).single()
      if (!course || course.teacher_id !== session.user.id) { router.push('/dashboard/teacher/courses'); return }
      const { data: les, error } = await supabase.from('lessons').select('*').eq('id',lessonId).eq('course_id',id).single()
      if (error || !les) { router.push(`/dashboard/teacher/courses/${id}/curriculum`); return }
      setLesson(les); setLoading(false)
    })()
  }, [id, lessonId])

  const showMsg = (type:'ok'|'err', text:string) => {
    setMsg({type, text})
    setTimeout(() => setMsg(null), 3500)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('lessons').update({
      title: lesson.title, content: lesson.content,
      is_preview: lesson.is_preview, type: lesson.type,
      video_url: lesson.video_url, cloudinary_public_id: lesson.cloudinary_public_id,
      updated_at: new Date().toISOString()
    }).eq('id', lesson.id)
    setSaving(false)
    showMsg(error ? 'err' : 'ok', error ? `فشل الحفظ: ${error.message}` : 'تم حفظ التغييرات بنجاح')
  }

  const handleVideoSuccess = async (url: string, publicId: string) => {
    setSaving(true)
    const { error } = await supabase.from('lessons').update({
      type:'video', video_url:url, cloudinary_public_id:publicId, updated_at:new Date().toISOString()
    }).eq('id', lessonId)
    if (!error) setLesson((p:any) => ({...p, type:'video', video_url:url, cloudinary_public_id:publicId}))
    setSaving(false)
    showMsg(error ? 'err' : 'ok', error ? 'فشل حفظ الفيديو' : 'تم رفع الفيديو وحفظه بنجاح')
  }

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  return (
    <div style={{maxWidth:760,margin:'0 auto',paddingBottom:60,display:'flex',flexDirection:'column',gap:22}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:20,borderBottom:'1px solid var(--border)'}}>
        <Link href={`/dashboard/teacher/courses/${id}/curriculum`}>
          <button className="btn btn-outline btn-sm" style={{padding:'8px'}}><ArrowRight size={16}/></button>
        </Link>
        <div>
          <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>تعديل محتوى الدرس</h1>
          <p style={{fontSize:13,color:'var(--teal)',fontWeight:600,marginTop:2}}>{lesson.title}</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:22}}>

        {/* Basic Info */}
        <div className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>المعلومات الأساسية</h3>
          <Input label="عنوان الدرس" value={lesson.title} required
            onChange={e=>setLesson({...lesson,title:e.target.value})}/>
          <label style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'var(--bg2)',borderRadius:10,border:'1px solid var(--border)',cursor:'pointer'}}>
            <input type="checkbox" checked={lesson.is_preview}
              onChange={e=>setLesson({...lesson,is_preview:e.target.checked})}
              style={{width:17,height:17,accentColor:'var(--teal)',cursor:'pointer'}}/>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>معاينة مجانية</div>
              <div style={{fontSize:12,color:'var(--txt2)'}}>يمكن للطلاب مشاهدة هذا الدرس قبل الاشتراك</div>
            </div>
          </label>
        </div>

        {/* Content Type */}
        <div className="card" style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)'}}>محتوى الدرس</h3>
            <div style={{display:'flex',background:'var(--bg2)',borderRadius:9,padding:3,border:'1px solid var(--border)',gap:3}}>
              {[{t:'فيديو',v:'video',I:Video},{t:'نص',v:'text',I:FileText}].map(({t,v,I})=>(
                <button key={v} type="button" onClick={()=>setLesson({...lesson,type:v})}
                  style={{padding:'6px 14px',borderRadius:7,fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all .15s',border:'none',background:lesson.type===v?'var(--teal)':'transparent',color:lesson.type===v?'#fff':'var(--txt2)'}}>
                  <I size={13}/>{t}
                </button>
              ))}
            </div>
          </div>

          {lesson.type === 'video' ? (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>رابط فيديو خارجي (YouTube أو رابط مباشر)</label>
                <input className="inp" placeholder="https://youtube.com/watch?v=..."
                  value={lesson.video_url||''} dir="ltr"
                  onChange={e=>setLesson({...lesson,video_url:e.target.value,cloudinary_public_id:null})}/>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1,height:1,background:'var(--border)'}}/>
                <span style={{fontSize:12,color:'var(--txt3)',fontWeight:600}}>أو ارفع من جهازك</span>
                <div style={{flex:1,height:1,background:'var(--border)'}}/>
              </div>
              <VideoUploader
                currentVideoUrl={lesson.cloudinary_public_id ? lesson.video_url : null}
                onSuccess={handleVideoSuccess}/>
            </div>
          ) : (
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>المحتوى النصي</label>
              <textarea className="inp" style={{minHeight:280,resize:'vertical'}}
                placeholder="اكتب محتوى الدرس هنا..."
                value={lesson.content||''}
                onChange={e=>setLesson({...lesson,content:e.target.value})}/>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:4}}>
          <div>
            {msg && (
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',borderRadius:9,background:msg.type==='ok'?'var(--ok-bg)':'var(--err-bg)',border:`1px solid ${msg.type==='ok'?'rgba(5,150,105,.15)':'rgba(220,38,38,.15)'}`}}>
                {msg.type==='ok' ? <CheckCircle size={15} style={{color:'var(--ok)'}}/> : <AlertCircle size={15} style={{color:'var(--err)'}}/>}
                <span style={{fontSize:13,fontWeight:700,color:msg.type==='ok'?'var(--ok)':'var(--err)'}}>{msg.text}</span>
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            {saving ? <Loader2 size={16} className="spin"/> : <Save size={16}/>}
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  )
}
