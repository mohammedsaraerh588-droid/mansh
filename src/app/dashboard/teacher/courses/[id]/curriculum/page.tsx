'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { ArrowRight, Plus, Video, FileText, Trash2, Edit2, Loader2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'

export default function CurriculumManager() {
  const { id }  = useParams()
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [course,          setCourse]         = useState<any>(null)
  const [modules,         setModules]        = useState<any[]>([])
  const [loading,         setLoading]        = useState(true)
  const [addingModule,    setAddingModule]   = useState(false)
  const [newModTitle,     setNewModTitle]    = useState('')
  const [addingLessonTo,  setAddingLessonTo] = useState<string|null>(null)
  const [newLesTitle,     setNewLesTitle]    = useState('')
  const [savingMod,       setSavingMod]      = useState(false)
  const [savingLes,       setSavingLes]      = useState(false)
  const [collapsed,       setCollapsed]      = useState<Record<string,boolean>>({})

  const fetchData = async () => {
    setLoading(true)
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    const { data:c } = await supabase.from('courses').select('id,title,teacher_id').eq('id',id).single()
    if (!c || c.teacher_id!==session.user.id) { router.push('/dashboard/teacher/courses'); return }
    setCourse(c)
    const { data:mods } = await supabase.from('modules').select('*,lessons(*)').eq('course_id',id).order('position',{ascending:true})
    if (mods) {
      mods.forEach((m:any) => m.lessons?.sort((a:any,b:any)=>a.position-b.position))
      setModules(mods)
    }
    setLoading(false)
  }

  useEffect(() => {
    void (async () => {
      await fetchData()
    })()
  }, [id])

  const addModule = async () => {
    if (!newModTitle.trim()) return
    setSavingMod(true)
    const pos = modules.length ? Math.max(...modules.map(m=>m.position))+1 : 1
    const { data, error } = await supabase.from('modules')
      .insert({ course_id:id, title:newModTitle.trim(), position:pos }).select().single()
    setSavingMod(false)
    if (!error && data) { setModules([...modules,{...data,lessons:[]}]); setNewModTitle(''); setAddingModule(false) }
  }

  const deleteModule = async (modId:string) => {
    if (!confirm('حذف هذا الفصل وجميع دروسه؟')) return
    setModules(modules.filter(m=>m.id!==modId))
    await supabase.from('modules').delete().eq('id',modId)
  }

  const addLesson = async (modId:string) => {
    if (!newLesTitle.trim()) return
    setSavingLes(true)
    const mod = modules.find(m=>m.id===modId)
    const pos = mod?.lessons?.length ? Math.max(...mod.lessons.map((l:any)=>l.position))+1 : 1
    const { data, error } = await supabase.from('lessons')
      .insert({ module_id:modId, course_id:id, title:newLesTitle.trim(), position:pos, type:'video', is_preview:false }).select().single()
    setSavingLes(false)
    if (!error && data) {
      setModules(modules.map(m=>m.id===modId?{...m,lessons:[...m.lessons,data]}:m))
      setAddingLessonTo(null); setNewLesTitle('')
    }
  }

  const deleteLesson = async (modId:string, lesId:string) => {
    if (!confirm('حذف هذا الدرس؟')) return
    setModules(modules.map(m=>m.id===modId?{...m,lessons:m.lessons.filter((l:any)=>l.id!==lesId)}:m))
    await supabase.from('lessons').delete().eq('id',lesId)
  }

  const toggleCollapse = (modId:string) => setCollapsed(p=>({...p,[modId]:!p[modId]}))

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  const totalLessons = modules.reduce((s,m)=>s+(m.lessons?.length||0),0)

  return (
    <div style={{maxWidth:800,margin:'0 auto',display:'flex',flexDirection:'column',gap:20,paddingBottom:60}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:18,borderBottom:'1px solid var(--border)'}}>
        <Link href={`/dashboard/teacher/courses/${id}`}>
          <button className="btn btn-outline btn-sm" style={{padding:'8px'}}><ArrowRight size={16}/></button>
        </Link>
        <div style={{flex:1}}>
          <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt1)'}}>المنهج والدروس</h1>
          <p style={{fontSize:13,color:'var(--txt2)',marginTop:2}}>{course?.title} — {modules.length} فصل · {totalLessons} درس</p>
        </div>
        <button onClick={()=>setAddingModule(true)} className="btn btn-primary btn-md">
          <Plus size={15}/>فصل جديد
        </button>
      </div>

      {/* Empty state */}
      {modules.length===0 && !addingModule && (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'var(--teal-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <BookOpen size={26} style={{color:'var(--teal)'}}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد فصول بعد</h3>
          <p style={{fontSize:14,color:'var(--txt2)',marginBottom:20}}>ابدأ ببناء منهجك من خلال إضافة الفصل الأول.</p>
          <button onClick={()=>setAddingModule(true)} className="btn btn-primary btn-lg">
            <Plus size={16}/>إضافة فصل جديد
          </button>
        </div>
      )}

      {/* Modules */}
      {modules.map((mod:any, mIdx:number)=>(
        <div key={mod.id} className="card" style={{overflow:'hidden'}}>
          {/* Module header */}
          <div style={{padding:'13px 16px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',flexShrink:0}}>{mIdx+1}</div>
            <span style={{fontWeight:800,fontSize:15,color:'var(--txt1)',flex:1}}>{mod.title}</span>
            <span style={{fontSize:12,color:'var(--txt3)'}}>{mod.lessons?.length||0} دروس</span>
            <button onClick={()=>toggleCollapse(mod.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txt3)',display:'flex',padding:4}}>
              {collapsed[mod.id]?<ChevronDown size={16}/>:<ChevronUp size={16}/>}
            </button>
            <button onClick={()=>deleteModule(mod.id)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',padding:4}}
              onMouseEnter={e=>(e.currentTarget.style.color='var(--err)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--txt3)')}>
              <Trash2 size={15} style={{color:'inherit'}}/>
            </button>
          </div>

          {!collapsed[mod.id] && (
            <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:6}}>
              {/* Lessons */}
              {mod.lessons?.length===0 && addingLessonTo!==mod.id && (
                <p style={{fontSize:13,color:'var(--txt3)',textAlign:'center',padding:'12px 0',fontStyle:'italic'}}>لا توجد دروس — أضف درساً الآن</p>
              )}
              {mod.lessons?.map((les:any, _lIdx:number)=>(
                <div key={les.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:9,border:'1px solid var(--border)',background:'var(--surface)',transition:'background .12s'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--bg2)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='var(--surface)')}>
                  <div style={{width:26,height:26,borderRadius:7,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {les.type==='video'?<Video size={12} style={{color:'var(--teal)'}}/>:<FileText size={12} style={{color:'var(--teal)'}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13.5,color:'var(--txt1)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{les.title}</div>
                    <div style={{fontSize:11,color:'var(--txt3)',display:'flex',gap:8,marginTop:2}}>
                      <span>{les.type==='video'?'فيديو':'نص'}</span>
                      {les.video_url && <span style={{color:'var(--ok)'}}>✓ تم رفع الفيديو</span>}
                      {les.is_preview && <span style={{color:'var(--teal)'}}>معاينة مجانية</span>}
                    </div>
                  </div>
                  <Link href={`/dashboard/teacher/courses/${id}/curriculum/lesson/${les.id}`}>
                    <button className="btn btn-outline btn-sm" style={{fontSize:12}}>
                      <Edit2 size={11}/>تعديل ومحتوى
                    </button>
                  </Link>
                  <button onClick={()=>deleteLesson(mod.id,les.id)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',padding:4,color:'var(--txt3)'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='var(--err)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--txt3)')}>
                    <Trash2 size={14} style={{color:'inherit'}}/>
                  </button>
                </div>
              ))}

              {/* Add lesson */}
              {addingLessonTo===mod.id ? (
                <div style={{display:'flex',gap:8,marginTop:6}}>
                  <input className="inp" style={{flex:1}} placeholder="عنوان الدرس الجديد..." autoFocus
                    value={newLesTitle} onChange={e=>setNewLesTitle(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter')addLesson(mod.id); if(e.key==='Escape'){setAddingLessonTo(null);setNewLesTitle('')} }}/>
                  <button onClick={()=>addLesson(mod.id)} disabled={savingLes} className="btn btn-primary btn-sm">
                    {savingLes?<Loader2 size={13} className="spin"/>:'إضافة'}
                  </button>
                  <button onClick={()=>{setAddingLessonTo(null);setNewLesTitle('')}} className="btn btn-outline btn-sm">إلغاء</button>
                </div>
              ) : (
                <button onClick={()=>setAddingLessonTo(mod.id)} style={{marginTop:4,padding:'9px',borderRadius:9,border:'2px dashed var(--border2)',background:'transparent',cursor:'pointer',fontSize:13,fontWeight:600,color:'var(--txt2)',width:'100%',transition:'all .15s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border2)';(e.currentTarget as HTMLElement).style.color='var(--txt2)'}}>
                  + إضافة درس
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add module form */}
      {addingModule && (
        <div className="card" style={{padding:22,border:'2px dashed var(--teal)'}}>
          <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',marginBottom:14}}>فصل جديد</h3>
          <div style={{display:'flex',gap:10}}>
            <input className="inp" style={{flex:1}} placeholder="عنوان الفصل (مثال: مقدمة في علم الأحياء)" autoFocus
              value={newModTitle} onChange={e=>setNewModTitle(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter')addModule(); if(e.key==='Escape'){setAddingModule(false);setNewModTitle('')} }}/>
            <button onClick={addModule} disabled={savingMod} className="btn btn-primary btn-md">
              {savingMod?<Loader2 size={15} className="spin"/>:'إنشاء'}
            </button>
            <button onClick={()=>{setAddingModule(false);setNewModTitle('')}} className="btn btn-outline btn-md">إلغاء</button>
          </div>
        </div>
      )}

      {modules.length>0 && !addingModule && (
        <button onClick={()=>setAddingModule(true)} style={{alignSelf:'center',padding:'10px 24px',borderRadius:10,border:'2px dashed var(--border2)',background:'transparent',cursor:'pointer',fontSize:14,fontWeight:700,color:'var(--txt2)',transition:'all .15s'}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border2)';(e.currentTarget as HTMLElement).style.color='var(--txt2)'}}>
          + إضافة فصل آخر
        </button>
      )}
    </div>
  )
}
