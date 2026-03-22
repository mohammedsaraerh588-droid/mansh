'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { ArrowRight, Save, Loader2, Video, FileText, CheckCircle,
         AlertCircle, Plus, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import VideoUploader from '@/components/ui/VideoUploader'

const OPTS = ['option_a','option_b','option_c','option_d'] as const
const LABELS = ['أ','ب','ج','د']

function emptyQ() {
  return { id: null, question:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_option:'option_a', position:0 }
}

export default function LessonEditorPage() {
  const { id, lessonId } = useParams()
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [lesson,    setLesson]    = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [savingQ,   setSavingQ]   = useState(false)
  const [msg,       setMsg]       = useState<{type:'ok'|'err',text:string}|null>(null)
  const [quizOpen,  setQuizOpen]  = useState(true)

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:course } = await supabase.from('courses').select('id,teacher_id').eq('id',id).single()
      if (!course||course.teacher_id!==session.user.id) { router.push('/dashboard/teacher/courses'); return }
      const { data:les } = await supabase.from('lessons').select('*').eq('id',lessonId).eq('course_id',id).single()
      if (!les) { router.push(`/dashboard/teacher/courses/${id}/curriculum`); return }
      setLesson(les)
      // load questions
      const { data:qs } = await supabase.from('quiz_questions')
        .select('*').eq('lesson_id',lessonId).order('position',{ascending:true})
      setQuestions(qs?.length ? qs : [])
      setLoading(false)
    })()
  },[id,lessonId])

  const showMsg = (type:'ok'|'err',text:string) => { setMsg({type,text}); setTimeout(()=>setMsg(null),3500) }

  const handleSaveLesson = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('lessons').update({
      title:lesson.title, content:lesson.content, is_preview:lesson.is_preview,
      type:lesson.type, video_url:lesson.video_url, cloudinary_public_id:lesson.cloudinary_public_id,
      updated_at:new Date().toISOString()
    }).eq('id',lesson.id)
    setSaving(false)
    showMsg(error?'err':'ok', error?`فشل الحفظ: ${error.message}`:'تم حفظ التغييرات بنجاح')
  }

  const handleVideoSuccess = async (url:string,publicId:string) => {
    setSaving(true)
    const { error } = await supabase.from('lessons').update(
      {type:'video',video_url:url,cloudinary_public_id:publicId,updated_at:new Date().toISOString()}
    ).eq('id',lessonId)
    if (!error) setLesson((p:any)=>({...p,type:'video',video_url:url,cloudinary_public_id:publicId}))
    setSaving(false)
    showMsg(error?'err':'ok',error?'فشل حفظ الفيديو':'تم رفع الفيديو وحفظه بنجاح')
  }

  /* ── Quiz CRUD ─────────────────────────────── */
  const addQuestion = () => {
    setQuestions(prev=>[...prev,{...emptyQ(),position:prev.length+1,_new:true,_key:Date.now()}])
  }

  const updateQ = (idx:number, field:string, val:string) => {
    setQuestions(prev=>prev.map((q,i)=>i===idx?{...q,[field]:val}:q))
  }

  const removeQ = async (idx:number) => {
    const q = questions[idx]
    if (q.id) await supabase.from('quiz_questions').delete().eq('id',q.id)
    setQuestions(prev=>prev.filter((_,i)=>i!==idx))
  }

  const saveQuestions = async () => {
    setSavingQ(true)
    for (let i=0;i<questions.length;i++) {
      const q = questions[i]
      const payload = {
        lesson_id:  lessonId, course_id: id,
        question:   q.question, option_a: q.option_a, option_b: q.option_b,
        option_c:   q.option_c, option_d: q.option_d,
        correct_option: q.correct_option, position: i+1,
      }
      if (q.id) {
        await supabase.from('quiz_questions').update(payload).eq('id',q.id)
      } else {
        const { data:saved } = await supabase.from('quiz_questions').insert(payload).select().single()
        if (saved) setQuestions(prev=>prev.map((x,j)=>j===i?{...x,id:saved.id,_new:false}:x))
      }
    }
    setSavingQ(false)
    showMsg('ok',`تم حفظ ${questions.length} سؤال بنجاح`)
  }

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  return (
    <div style={{maxWidth:800,margin:'0 auto',paddingBottom:60,display:'flex',flexDirection:'column',gap:22}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
        <Link href={`/dashboard/teacher/courses/${id}/curriculum`}>
          <button className="btn btn-outline btn-sm" style={{padding:'8px'}}><ArrowRight size={16}/></button>
        </Link>
        <div>
          <h1 style={{fontSize:21,fontWeight:900,color:'var(--txt1)'}}>تعديل محتوى الدرس</h1>
          <p style={{fontSize:13,color:'var(--teal)',fontWeight:600,marginTop:2}}>{lesson.title}</p>
        </div>
      </div>

      {/* ── محتوى الدرس ─────────────────────── */}
      <form onSubmit={handleSaveLesson} style={{display:'flex',flexDirection:'column',gap:18}}>
        <div className="card" style={{padding:22,display:'flex',flexDirection:'column',gap:14}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>المعلومات الأساسية</h3>
          <Input label="عنوان الدرس *" value={lesson.title} required onChange={e=>setLesson({...lesson,title:e.target.value})}/>
          <label style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:'var(--bg2)',borderRadius:10,border:'1px solid var(--border)',cursor:'pointer'}}>
            <input type="checkbox" checked={lesson.is_preview} style={{width:17,height:17,accentColor:'var(--teal)'}}
              onChange={e=>setLesson({...lesson,is_preview:e.target.checked})}/>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>معاينة مجانية</div>
              <div style={{fontSize:12,color:'var(--txt2)'}}>يمكن للطلاب مشاهدة هذا الدرس قبل الاشتراك</div>
            </div>
          </label>
        </div>

        <div className="card" style={{padding:22,display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
            <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)'}}>محتوى الدرس</h3>
            <div style={{display:'flex',background:'var(--bg2)',borderRadius:9,padding:3,border:'1px solid var(--border)',gap:2}}>
              {[{t:'فيديو',v:'video',I:Video},{t:'نص',v:'text',I:FileText}].map(({t,v,I})=>(
                <button key={v} type="button" onClick={()=>setLesson({...lesson,type:v})}
                  style={{padding:'6px 14px',borderRadius:7,fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5,border:'none',background:lesson.type===v?'var(--teal)':'transparent',color:lesson.type===v?'#fff':'var(--txt2)'}}>
                  <I size={13}/>{t}
                </button>
              ))}
            </div>
          </div>
          {lesson.type==='video' ? (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>رابط YouTube أو رابط مباشر</label>
                <input className="inp" placeholder="https://youtube.com/watch?v=..." dir="ltr"
                  value={lesson.video_url||''} onChange={e=>setLesson({...lesson,video_url:e.target.value,cloudinary_public_id:null})}/>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1,height:1,background:'var(--border)'}}/>
                <span style={{fontSize:12,color:'var(--txt3)',fontWeight:600}}>أو ارفع من جهازك</span>
                <div style={{flex:1,height:1,background:'var(--border)'}}/>
              </div>
              <VideoUploader onUploaded={(publicId, url) => handleVideoSuccess(publicId, url)}/>
            </div>
          ) : (
            <div>
              <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>المحتوى النصي</label>
              <textarea className="inp" style={{minHeight:240,resize:'vertical'}} placeholder="اكتب محتوى الدرس هنا..."
                value={lesson.content||''} onChange={e=>setLesson({...lesson,content:e.target.value})}/>
            </div>
          )}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            {msg && (
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',borderRadius:9,background:msg.type==='ok'?'var(--ok-bg)':'var(--err-bg)'}}>
                {msg.type==='ok'?<CheckCircle size={14} style={{color:'var(--ok)'}}/>:<AlertCircle size={14} style={{color:'var(--err)'}}/>}
                <span style={{fontSize:13,fontWeight:700,color:msg.type==='ok'?'var(--ok)':'var(--err)'}}>{msg.text}</span>
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            {saving?<><Loader2 size={15} className="spin"/>جاري الحفظ...</>:<><Save size={15}/>حفظ الدرس</>}
          </button>
        </div>
      </form>

      {/* ── نظام الاختبار ─────────────────────── */}
      <div className="card" style={{overflow:'hidden'}}>
        {/* Header */}
        <button type="button" onClick={()=>setQuizOpen(!quizOpen)}
          style={{width:'100%',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'none',border:'none',cursor:'pointer',textAlign:'right',borderBottom:quizOpen?'1px solid var(--border)':'none'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <HelpCircle size={18} style={{color:'var(--teal)'}}/>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:800,fontSize:15,color:'var(--txt1)'}}>
                اختبار الدرس
                {questions.length>0 && <span className="badge badge-teal" style={{marginRight:8,fontSize:10}}>{questions.length} سؤال</span>}
              </div>
              <div style={{fontSize:12,color:'var(--txt2)',marginTop:1}}>يظهر للطالب بعد إنهاء الفيديو</div>
            </div>
          </div>
          {quizOpen?<ChevronUp size={18} style={{color:'var(--txt3)'}}/>:<ChevronDown size={18} style={{color:'var(--txt3)'}}/>}
        </button>

        {quizOpen && (
          <div style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
            {questions.length===0 && (
              <div style={{textAlign:'center',padding:'24px 0',color:'var(--txt3)',fontSize:14}}>
                لا توجد أسئلة بعد — أضف أسئلة MCQ للاختبار
              </div>
            )}

            {questions.map((q,idx)=>(
              <div key={q.id||q._key||idx} className="card" style={{padding:18,background:'var(--bg2)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <span style={{fontSize:12,fontWeight:800,color:'var(--teal)'}}>السؤال {idx+1}</span>
                  <button type="button" onClick={()=>removeQ(idx)}
                    className="btn btn-danger btn-sm" style={{padding:'5px 10px'}}>
                    <Trash2 size={13}/>حذف
                  </button>
                </div>

                {/* Question text */}
                <div style={{marginBottom:12}}>
                  <label style={{display:'block',fontSize:12,fontWeight:700,marginBottom:5,color:'var(--txt2)'}}>نص السؤال *</label>
                  <textarea className="inp" style={{minHeight:64,resize:'vertical',fontSize:14}}
                    placeholder="اكتب السؤال هنا..." value={q.question}
                    onChange={e=>updateQ(idx,'question',e.target.value)}/>
                </div>

                {/* Options */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                  {OPTS.map((opt,oi)=>(
                    <div key={opt}>
                      <label style={{display:'block',fontSize:12,fontWeight:700,marginBottom:4,color:'var(--txt2)'}}>
                        الخيار {LABELS[oi]}
                        {q.correct_option===opt && (
                          <span style={{marginRight:6,fontSize:10,color:'var(--ok)',fontWeight:800}}>✓ الصحيح</span>
                        )}
                      </label>
                      <input className="inp" style={{fontSize:13}} placeholder={`الخيار ${LABELS[oi]}`}
                        value={q[opt]||''} onChange={e=>updateQ(idx,opt,e.target.value)}/>
                    </div>
                  ))}
                </div>

                {/* Correct answer selector */}
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:12,fontWeight:700,color:'var(--txt2)',flexShrink:0}}>الإجابة الصحيحة:</span>
                  <div style={{display:'flex',gap:6}}>
                    {OPTS.map((opt,oi)=>(
                      <button key={opt} type="button" onClick={()=>updateQ(idx,'correct_option',opt)}
                        style={{padding:'5px 14px',borderRadius:8,border:`2px solid ${q.correct_option===opt?'var(--ok)':'var(--border)'}`,background:q.correct_option===opt?'var(--ok-bg)':'var(--surface)',color:q.correct_option===opt?'var(--ok)':'var(--txt2)',fontWeight:700,fontSize:13,cursor:'pointer',transition:'all .15s'}}>
                        {LABELS[oi]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div style={{display:'flex',gap:10,justifyContent:'space-between',paddingTop:4}}>
              <button type="button" onClick={addQuestion} className="btn btn-outline btn-md">
                <Plus size={15}/>إضافة سؤال
              </button>
              {questions.length>0 && (
                <button type="button" onClick={saveQuestions} disabled={savingQ} className="btn btn-primary btn-md">
                  {savingQ?<><Loader2 size={14} className="spin"/>جاري الحفظ...</>:<><Save size={14}/>حفظ الأسئلة</>}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
