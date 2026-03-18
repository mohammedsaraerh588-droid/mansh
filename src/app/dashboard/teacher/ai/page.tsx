'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, Sparkles, FileText, Image, HelpCircle,
         Loader2, Copy, Check, Trash2, ChevronDown, Wand2, Bot } from 'lucide-react'

type Mode = 'chat' | 'file' | 'quiz' | 'image'
type Msg  = { role:'user'|'model'; text:string; imgUrl?:string; isLoading?:boolean }

const SUGGESTIONS = {
  chat: [
    'اشرح لي آلية عمل الجهاز المناعي بأسلوب مبسط',
    'ما الفرق بين الخلية T المساعدة والخلية T القاتلة؟',
    'أعطني خطة درس لشرح الفشل الكلوي المزمن',
    'كيف أشرح الأمراض القلبية لطلاب السنة الثالثة؟',
  ],
  quiz: [
    'أسئلة عن الجهاز القلبي الوعائي',
    'أسئلة عن أمراض الجهاز التنفسي',
    'أسئلة في علم الصيدلة السريرية',
    'أسئلة عن الجهاز العصبي المركزي',
  ],
  image: [
    'رسم تشريحي للقلب البشري',
    'مخطط دورة الدم الكبرى والصغرى',
    'صورة خلية عصبية مع أجزائها',
    'رسم بياني لمراحل التئام الجروح',
  ],
  file: [],
}

export default function TeacherAIPage() {
  const [mode,     setMode]     = useState<Mode>('chat')
  const [msgs,     setMsgs]     = useState<Msg[]>([])
  const [input,    setInput]    = useState('')
  const [file,     setFile]     = useState<File|null>(null)
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState<number|null>(null)
  const [quizCount,setQuizCount]= useState(5)
  const [imgLoading,setImgLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)
  const taRef     = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  /* ── إرسال رسالة أو ملف ─────────────────── */
  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text && !file) return

    const userMsg: Msg = { role:'user', text: file ? `📎 ${file.name}\n${text}` : text }
    setMsgs(p => [...p, userMsg, { role:'model', text:'', isLoading:true }])
    setInput(''); setLoading(true)

    try {
      const fd = new FormData()
      fd.append('message', text)
      fd.append('history', JSON.stringify(
        msgs.filter(m=>!m.isLoading&&m.role!=='model'||m.text)
            .map(m=>({ role:m.role, text:m.text })).slice(-10)
      ))

      if (mode === 'file' && file) {
        fd.append('mode', 'file'); fd.append('file', file)
      } else if (mode === 'quiz') {
        fd.append('mode', 'quiz'); fd.append('count', String(quizCount))
      } else {
        fd.append('mode', 'chat')
      }

      const res  = await fetch('/api/ai', { method:'POST', body:fd })
      const data = await res.json()

      if (!res.ok || data.error) {
        const errText = data.error || 'خطأ غير معروف'
        setMsgs(p => p.map((m,i) => i===p.length-1 ? { role:'model', text: errText } : m))
        return
      }

      setMsgs(p => p.map((m,i) =>
        i === p.length-1 ? { role:'model', text: data.text, questions: data.questions } : m
      ))
      setFile(null)
    } catch (e: any) {
      setMsgs(p => p.map((m,i) =>
        i === p.length-1 ? { role:'model', text:`❌ ${e.message}` } : m
      ))
    } finally { setLoading(false) }
  }

  /* ── توليد صورة عبر Pollinations (مجاني 100%) ── */
  const generateImage = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text) return
    setMsgs(p => [...p, { role:'user', text }, { role:'model', text:'🎨 جاري توليد الصورة...', isLoading:true }])
    setInput(''); setImgLoading(true)
    // Pollinations.ai - مجاني تماماً بدون API key
    const prompt = encodeURIComponent(`medical educational illustration: ${text}, professional, detailed, clean white background, scientific diagram style`)
    const url    = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true`
    // نتحقق من تحميل الصورة
    const img = new window.Image()
    img.onload = () => {
      setMsgs(p => p.map((m,i) =>
        i === p.length-1 ? { role:'model', text:`🎨 تم توليد الصورة: "${text}"`, imgUrl: url } : m
      ))
      setImgLoading(false)
    }
    img.onerror = () => {
      setMsgs(p => p.map((m,i) =>
        i === p.length-1 ? { role:'model', text:'❌ فشل توليد الصورة. حاول مرة أخرى.' } : m
      ))
      setImgLoading(false)
    }
    img.src = url
  }

  const handleSend = () => mode === 'image' ? generateImage() : sendMessage()

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopied(idx); setTimeout(() => setCopied(null), 2000)
  }

  const clearChat = () => { setMsgs([]); setFile(null); setInput('') }

  const MODES: Array<{id:Mode, label:string, icon:any, color:string, desc:string}> = [
    { id:'chat',  label:'محادثة',    icon:Bot,        color:'var(--teal)',    desc:'اسأل أي سؤال طبي' },
    { id:'file',  label:'تحليل ملف', icon:FileText,   color:'#2563eb',        desc:'PDF, صور, نصوص' },
    { id:'quiz',  label:'أسئلة MCQ', icon:HelpCircle, color:'#7c3aed',        desc:'توليد تلقائي' },
    { id:'image', label:'توليد صورة',icon:Image,      color:'#d97706',        desc:'رسوم طبية مجاناً' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 120px)',gap:0}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexShrink:0}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,var(--teal),var(--teal2))',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Sparkles size={18} style={{color:'#fff'}}/>
            </div>
            <div>
              <h1 style={{fontSize:20,fontWeight:900,color:'var(--txt1)'}}>مساعد AI الطبي</h1>
              <p style={{fontSize:12,color:'var(--txt3)'}}>مجاني تماماً • Pollinations AI • بدون حدود</p>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="btn btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:6}}>
          <Trash2 size={13}/>مسح المحادثة
        </button>
      </div>

      {/* Mode selector */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:14,flexShrink:0}}>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>setMode(m.id)}
            style={{padding:'10px 8px',borderRadius:10,border:`2px solid ${mode===m.id?m.color:'var(--border)'}`,background:mode===m.id?`${m.color}15`:'var(--surface)',cursor:'pointer',textAlign:'center',transition:'all .15s'}}>
            <m.icon size={18} style={{color:mode===m.id?m.color:'var(--txt3)',margin:'0 auto 4px',display:'block'}}/>
            <div style={{fontSize:12,fontWeight:700,color:mode===m.id?m.color:'var(--txt1)'}}>{m.label}</div>
            <div style={{fontSize:10,color:'var(--txt3)',marginTop:1}}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div style={{flex:1,overflowY:'auto',borderRadius:14,border:'1px solid var(--border)',background:'var(--surface)',padding:'16px',display:'flex',flexDirection:'column',gap:14}}>
        {msgs.length===0 && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:20,padding:'20px 0'}}>
            <div style={{width:60,height:60,borderRadius:16,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Sparkles size={28} style={{color:'var(--teal)'}}/>
            </div>
            <div style={{textAlign:'center'}}>
              <h3 style={{fontSize:17,fontWeight:800,color:'var(--txt1)',marginBottom:4}}>
                {MODES.find(m=>m.id===mode)?.label}
              </h3>
              <p style={{fontSize:13,color:'var(--txt3)'}}>
                {mode==='chat'  && 'اسأل أي سؤال طبي وسأجيبك فوراً'}
                {mode==='file'  && 'ارفع ملف PDF أو صورة وسأحللها لك'}
                {mode==='quiz'  && 'أدخل موضوعاً وسأنشئ أسئلة MCQ طبية'}
                {mode==='image' && 'اطلب رسماً طبياً وسأولّده مجاناً'}
              </p>
            </div>
            {(SUGGESTIONS[mode]||[]).length>0 && (
              <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',maxWidth:520}}>
                {SUGGESTIONS[mode].map((s,i)=>(
                  <button key={i} onClick={()=>mode==='image'?generateImage(s):sendMessage(s)}
                    style={{padding:'7px 14px',borderRadius:99,border:'1px solid var(--border)',background:'var(--bg2)',fontSize:12,color:'var(--txt2)',cursor:'pointer',transition:'all .15s',fontFamily:'inherit'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border)';(e.currentTarget as HTMLElement).style.color='var(--txt2)'}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {msgs.map((msg,i)=>(
          <div key={i} style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
            {/* Avatar */}
            <div style={{width:30,height:30,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              background:msg.role==='user'?'var(--teal)':'linear-gradient(135deg,#7c3aed,#a78bfa)',fontSize:14,fontWeight:900,color:'#fff'}}>
              {msg.role==='user'?'أ':<Sparkles size={14}/>}
            </div>
            {/* Bubble */}
            <div style={{maxWidth:'78%',position:'relative'}}>
              <div style={{
                padding:'12px 14px',borderRadius:msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px',
                background:msg.role==='user'?'var(--teal)':'var(--bg2)',
                color:msg.role==='user'?'#fff':'var(--txt1)',
                fontSize:14,lineHeight:1.75,
                border:msg.role==='model'?'1px solid var(--border)':'none',
              }}>
                {msg.isLoading ? (
                  <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--txt3)'}}>
                    <Loader2 size={14} className="spin"/><span style={{fontSize:13}}>جاري التفكير...</span>
                  </div>
                ) : (
                  <div style={{whiteSpace:'pre-wrap'}}>{msg.text}</div>
                )}
                {msg.imgUrl && (
                  <div style={{marginTop:10}}>
                    <img src={msg.imgUrl} alt="توليد صورة طبية" style={{width:'100%',borderRadius:8,border:'1px solid var(--border)'}}/>
                    <a href={msg.imgUrl} download="medical-image.jpg" className="btn btn-outline btn-sm" style={{marginTop:8,display:'inline-flex',textDecoration:'none'}}>
                      تحميل الصورة
                    </a>
                  </div>
                )}
              </div>
              {/* Copy button */}
              {msg.role==='model' && !msg.isLoading && (
                <button onClick={()=>copyText(msg.text,i)}
                  style={{position:'absolute',top:6,left:-32,width:24,height:24,borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:.7}}
                  title="نسخ">
                  {copied===i?<Check size={12} style={{color:'var(--ok)'}}/>:<Copy size={11} style={{color:'var(--txt3)'}}/>}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {/* Input area */}
      <div style={{marginTop:12,flexShrink:0}}>
        {/* File preview */}
        {file && (
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:9,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',marginBottom:8}}>
            <FileText size={15} style={{color:'var(--teal)'}}/>
            <span style={{fontSize:13,color:'var(--teal)',fontWeight:600,flex:1}}>{file.name}</span>
            <button onClick={()=>setFile(null)} style={{background:'none',border:'none',cursor:'pointer',display:'flex'}}>
              <X size={14} style={{color:'var(--txt3)'}}/>
            </button>
          </div>
        )}

        {/* Quiz count */}
        {mode==='quiz' && (
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,fontSize:13,color:'var(--txt2)'}}>
            <span>عدد الأسئلة:</span>
            {[3,5,10,15].map(n=>(
              <button key={n} onClick={()=>setQuizCount(n)}
                style={{padding:'3px 12px',borderRadius:99,border:`1.5px solid ${quizCount===n?'var(--teal)':'var(--border)'}`,background:quizCount===n?'var(--teal-soft)':'transparent',color:quizCount===n?'var(--teal)':'var(--txt2)',fontSize:13,fontWeight:700,cursor:'pointer'}}>
                {n}
              </button>
            ))}
          </div>
        )}

        <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
          <div style={{flex:1,position:'relative'}}>
            <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={
                mode==='chat'  ? 'اسأل سؤالاً طبياً...' :
                mode==='file'  ? 'اكتب تعليمات للتحليل (اختياري)...' :
                mode==='quiz'  ? 'أدخل الموضوع الطبي لتوليد الأسئلة...' :
                                 'صف الصورة الطبية التي تريدها...'
              }
              rows={1}
              style={{width:'100%',padding:'12px 44px 12px 14px',borderRadius:11,border:'1.5px solid var(--border)',background:'var(--surface)',color:'var(--txt1)',fontSize:14,outline:'none',resize:'none',lineHeight:1.5,fontFamily:'inherit',transition:'border-color .2s'}}
              onFocus={e=>(e.target.style.borderColor='var(--teal)')}
              onBlur={e=>(e.target.style.borderColor='var(--border)')}/>
            {/* File attach */}
            {(mode==='file') && (
              <button onClick={()=>fileRef.current?.click()}
                style={{position:'absolute',left:12,bottom:10,background:'none',border:'none',cursor:'pointer',display:'flex',padding:2}}
                title="إرفاق ملف">
                <Paperclip size={16} style={{color:'var(--txt3)'}}/>
              </button>
            )}
          </div>
          {/* Send */}
          <button onClick={handleSend} disabled={loading||imgLoading||(!input.trim()&&!file)}
            className="btn btn-primary btn-md"
            style={{padding:'12px 16px',borderRadius:11,height:46,flexShrink:0}}>
            {loading||imgLoading
              ? <Loader2 size={18} className="spin"/>
              : mode==='image'
                ? <Wand2 size={18}/>
                : <Send size={18}/>}
          </button>
        </div>
        <input ref={fileRef} type="file" className="hidden"
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif"
          onChange={e=>{ if(e.target.files?.[0]) setFile(e.target.files[0]) }}/>
        <p style={{fontSize:11,color:'var(--txt3)',textAlign:'center',marginTop:6}}>
          Pollinations AI • مجاني 100% بدون API key • بدون حدود يومية
        </p>
      </div>
    </div>
  )
}
