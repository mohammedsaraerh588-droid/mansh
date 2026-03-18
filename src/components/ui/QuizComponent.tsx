'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trophy, RotateCcw, Loader2, Clock, Award } from 'lucide-react'

interface Question {
  id: string; question: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  points: number;
}
interface Props {
  lessonId: string
  lessonTitle: string
  onClose: () => void
}

export default function QuizComponent({ lessonId, lessonTitle, onClose }: Props) {
  const [questions,     setQuestions]     = useState<Question[]>([])
  const [leaderboard,   setLeaderboard]   = useState<any[]>([])
  const [prevAttempt,   setPrevAttempt]   = useState<any>(null)
  const [loading,       setLoading]       = useState(true)
  const [answers,       setAnswers]       = useState<Record<string,string>>({})
  const [submitting,    setSubmitting]    = useState(false)
  const [result,        setResult]        = useState<any>(null)
  const [correctMap,    setCorrectMap]    = useState<Record<string,boolean>>({})
  const [current,       setCurrent]       = useState(0)
  const [seconds,       setSeconds]       = useState(0)
  const [timerOn,       setTimerOn]       = useState(false)

  useEffect(() => {
    fetch(`/api/quiz?lessonId=${lessonId}`)
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || [])
        setLeaderboard(d.leaderboard || [])
        setPrevAttempt(d.previousAttempt)
        setLoading(false)
        if (d.questions?.length > 0) setTimerOn(true)
      })
  }, [lessonId])

  useEffect(() => {
    if (!timerOn) return
    const t = setInterval(() => setSeconds(s => s+1), 1000)
    return () => clearInterval(t)
  }, [timerOn])

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const handleSelect = (qId: string, opt: string) => {
    if (result) return
    setAnswers(p => ({ ...p, [qId]: opt }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('يرجى الإجابة على جميع الأسئلة قبل التسليم')
      return
    }
    setSubmitting(true); setTimerOn(false)
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, answers }),
    })
    const data = await res.json()
    setResult(data)
    setCorrectMap(data.result || {})
    setSubmitting(false)
    // reload leaderboard
    fetch(`/api/quiz?lessonId=${lessonId}`).then(r=>r.json()).then(d=>setLeaderboard(d.leaderboard||[]))
  }

  const handleRetry = () => {
    setAnswers({}); setResult(null); setCorrectMap({}); setCurrent(0); setSeconds(0); setTimerOn(true)
  }

  const pct = result ? Math.round((result.score / result.totalPoints) * 100) : 0
  const options: Array<{key:string,label:string}> = [
    {key:'a',label:'أ'},{key:'b',label:'ب'},{key:'c',label:'ج'},{key:'d',label:'د'}
  ]

  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:300,gap:12}}>
      <Loader2 size={32} className="spin" style={{color:'var(--teal)'}}/>
      <p style={{color:'var(--txt2)',fontSize:14}}>جاري تحميل الاختبار...</p>
    </div>
  )

  if (!questions.length) return (
    <div style={{textAlign:'center',padding:'48px 20px'}}>
      <div style={{fontSize:48,marginBottom:12}}>📝</div>
      <h3 style={{fontSize:18,fontWeight:800,color:'var(--txt1)',marginBottom:8}}>لا يوجد اختبار لهذا الدرس بعد</h3>
      <p style={{color:'var(--txt2)',fontSize:14,marginBottom:20}}>سيضيف المعلم اختباراً قريباً.</p>
      <button onClick={onClose} className="btn btn-outline btn-md">إغلاق</button>
    </div>
  )

  // نتيجة الاختبار
  if (result) {
    return (
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        {/* Score card */}
        <div style={{textAlign:'center',padding:'28px 20px',borderRadius:14,background:result.passed?'var(--ok-bg)':'var(--err-bg)',border:`1px solid ${result.passed?'rgba(5,150,105,.2)':'rgba(220,38,38,.2)'}`}}>
          <div style={{fontSize:64,fontWeight:900,lineHeight:1,color:result.passed?'var(--ok)':'var(--err)'}}>{pct}%</div>
          <div style={{fontSize:18,fontWeight:800,marginTop:8,color:result.passed?'var(--ok)':'var(--err)'}}>
            {result.passed ? '🎉 أحسنت! اجتزت الاختبار' : '😔 للأسف لم تجتز الاختبار'}
          </div>
          <div style={{fontSize:14,color:'var(--txt2)',marginTop:6}}>{result.score} / {result.totalPoints} نقطة</div>
        </div>

        {/* Questions review */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <h3 style={{fontSize:15,fontWeight:800,color:'var(--txt1)'}}>مراجعة الإجابات</h3>
          {questions.map((q,i) => {
            const isOk = correctMap[q.id]
            return (
              <div key={q.id} style={{padding:'14px 16px',borderRadius:12,border:`1.5px solid ${isOk?'rgba(5,150,105,.25)':'rgba(220,38,38,.25)'}`,background:isOk?'var(--ok-bg)':'var(--err-bg)'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:8}}>
                  {isOk ? <CheckCircle size={17} style={{color:'var(--ok)',flexShrink:0,marginTop:2}}/> : <XCircle size={17} style={{color:'var(--err)',flexShrink:0,marginTop:2}}/>}
                  <span style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>{i+1}. {q.question}</span>
                </div>
                <div style={{paddingRight:27,fontSize:13,color:'var(--txt2)'}}>
                  إجابتك: <b style={{color:isOk?'var(--ok)':'var(--err)'}}>
                    {answers[q.id] ? `${options.find(o=>o.key===answers[q.id])?.label}. ${q[`option_${answers[q.id]}` as keyof Question]}` : 'لم تجب'}
                  </b>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
              <Trophy size={16} style={{color:'#f59e0b'}}/><h3 style={{fontWeight:800,fontSize:14,color:'var(--txt1)'}}>لوحة الصدارة</h3>
            </div>
            {leaderboard.slice(0,5).map((e:any,i:number)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',borderBottom:'1px solid var(--border)'}}>
                <span style={{width:24,height:24,borderRadius:'50%',background:i===0?'#f59e0b':i===1?'#9ca3af':i===2?'#cd7c2f':'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:i<3?'#fff':'var(--txt3)',flexShrink:0}}>{i+1}</span>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:'var(--txt1)'}}>{e.profiles?.full_name||'طالب'}</span>
                <span style={{fontWeight:800,fontSize:13,color:'var(--teal)'}}>{Math.round((e.score/e.total_points)*100)}%</span>
              </div>
            ))}
          </div>
        )}

        <div style={{display:'flex',gap:10}}>
          <button onClick={handleRetry} className="btn btn-outline btn-md" style={{flex:1}}>
            <RotateCcw size={14}/>إعادة الاختبار
          </button>
          <button onClick={onClose} className="btn btn-primary btn-md" style={{flex:1}}>
            {result.passed ? 'متابعة الدرس التالي' : 'إغلاق'}
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const answered = Object.keys(answers).length

  // الاختبار — سؤال بسؤال
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h3 style={{fontSize:15,fontWeight:800,color:'var(--txt1)'}}>اختبار: {lessonTitle}</h3>
          <p style={{fontSize:12,color:'var(--txt3)',marginTop:2}}>{answered}/{questions.length} سؤال تم الإجابة عليه</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:8,background:'var(--bg2)',border:'1px solid var(--border)'}}>
          <Clock size={13} style={{color:'var(--teal)'}}/>
          <span style={{fontWeight:700,fontSize:13,color:'var(--teal)',fontVariantNumeric:'tabular-nums'}}>{fmt(seconds)}</span>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{display:'flex',gap:4}}>
          {questions.map((_,i)=>(
            <div key={i} style={{flex:1,height:4,borderRadius:99,background:answers[questions[i].id]?'var(--teal)':i===current?'var(--teal2)':'var(--bg3)',cursor:'pointer',transition:'background .2s'}}
              onClick={()=>setCurrent(i)}/>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--txt3)',marginTop:4}}>
          <span>سؤال {current+1} من {questions.length}</span>
          <span>{questions.reduce((s,q_)=>s+(q_.points||1),0)} نقطة إجمالاً</span>
        </div>
      </div>

      {/* Question */}
      <div style={{padding:'20px',borderRadius:12,background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <p style={{fontWeight:700,fontSize:15,color:'var(--txt1)',lineHeight:1.65,marginBottom:18}}>
          <span style={{color:'var(--teal)',fontWeight:900,marginLeft:6}}>{current+1}.</span>{q.question}
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {options.map(({key,label})=>{
            const optText = q[`option_${key}` as keyof Question] as string
            if (!optText) return null
            const selected = answers[q.id] === key
            return (
              <button key={key} onClick={()=>handleSelect(q.id, key)}
                style={{
                  width:'100%',textAlign:'right',padding:'12px 14px',borderRadius:10,cursor:'pointer',
                  display:'flex',alignItems:'center',gap:10,transition:'all .15s',
                  border: selected ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                  background: selected ? 'var(--teal-soft)' : 'var(--surface)',
                  fontFamily:'inherit', fontSize:14,
                }}>
                <span style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flexShrink:0,background:selected?'var(--teal)':'var(--bg3)',color:selected?'#fff':'var(--txt2)',transition:'all .15s'}}>
                  {label}
                </span>
                <span style={{color: selected ? 'var(--teal)' : 'var(--txt1)', fontWeight: selected ? 700 : 500}}>{optText}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>setCurrent(Math.max(0,current-1))} disabled={current===0}
          className="btn btn-outline btn-md" style={{flex:1}}>السابق</button>
        {current < questions.length-1 ? (
          <button onClick={()=>setCurrent(current+1)} className="btn btn-primary btn-md" style={{flex:2}}>
            التالي →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || answered < questions.length}
            className="btn btn-primary btn-md" style={{flex:2}}>
            {submitting ? <><Loader2 size={15} className="spin"/>جاري التصحيح...</> : <><Award size={15}/>تسليم الاختبار</>}
          </button>
        )}
      </div>

      {prevAttempt && !result && (
        <p style={{fontSize:12,color:'var(--txt3)',textAlign:'center'}}>
          محاولتك السابقة: {Math.round((prevAttempt.score/prevAttempt.total_points)*100)}% — {prevAttempt.passed?'✅ اجتزت':'❌ لم تجتز'}
        </p>
      )}
    </div>
  )
}
