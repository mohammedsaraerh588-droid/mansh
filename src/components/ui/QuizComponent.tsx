'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trophy, RotateCcw, Loader2, Clock, Award } from 'lucide-react'

interface Question {
  id: string; question: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  points: number;
}
interface Props { lessonId: string; lessonTitle: string; onClose: () => void }

export default function QuizComponent({ lessonId, lessonTitle, onClose }: Props) {
  const [questions,   setQuestions]   = useState<Question[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [prevAttempt, setPrevAttempt] = useState<any>(null)
  const [loading,     setLoading]     = useState(true)
  const [answers,     setAnswers]     = useState<Record<string,string>>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [result,      setResult]      = useState<any>(null)
  const [correctMap,  setCorrectMap]  = useState<Record<string,boolean>>({})
  const [current,     setCurrent]     = useState(0)
  const [seconds,     setSeconds]     = useState(0)
  const [timerOn,     setTimerOn]     = useState(false)

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
      .catch(e => { console.error('[QUIZ_LOAD]', e); setLoading(false) })
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
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, answers }),
      })
      const data = await res.json()
      setResult(data)
      setCorrectMap(data.result || {})
      fetch(`/api/quiz?lessonId=${lessonId}`)
        .then(r => r.json())
        .then(d => setLeaderboard(d.leaderboard || []))
        .catch(e => console.error('[QUIZ_LEADERBOARD]', e))
    } catch (e) {
      console.error('[QUIZ_SUBMIT]', e)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({}); setResult(null); setCorrectMap({}); setCurrent(0); setSeconds(0); setTimerOn(true)
  }

  const pct = result ? Math.round((result.score / result.totalPoints) * 100) : 0
  const OPTIONS: Array<{key:string; label:string}> = [
    {key:'a', label:'أ'}, {key:'b', label:'ب'}, {key:'c', label:'ج'}, {key:'d', label:'د'}
  ]

  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:300,gap:12}}>
      <Loader2 size={28} className="spin" style={{color:'var(--alpha-green)'}}/>
      <p style={{color:'var(--tx3)',fontSize:14}}>جاري تحميل الأسئلة...</p>
    </div>
  )

  if (!questions.length) return (
    <div style={{textAlign:'center',padding:'48px 24px'}}>
      <p style={{color:'var(--tx3)',fontSize:15}}>لا توجد أسئلة لهذا الدرس.</p>
      <button onClick={onClose} className="btn btn-outline btn-md" style={{marginTop:16}}>إغلاق</button>
    </div>
  )

  const q = questions[current]

  if (result) return (
    <div style={{padding:'24px 20px',textAlign:'center'}}>
      <div style={{width:70,height:70,borderRadius:'50%',background:result.passed?'var(--ok-bg)':'var(--err-bg)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
        {result.passed
          ? <Trophy size={32} style={{color:'var(--ok)'}}/>
          : <XCircle size={32} style={{color:'var(--err)'}}/>}
      </div>
      <h3 style={{fontSize:22,fontWeight:900,color:'var(--tx1)',marginBottom:6}}>
        {result.passed ? 'أحسنت! اجتزت الاختبار 🎉' : 'لم تجتز الاختبار'}
      </h3>
      <p style={{fontSize:32,fontWeight:900,color:result.passed?'var(--ok)':'var(--err)',marginBottom:4}}>{pct}%</p>
      <p style={{fontSize:14,color:'var(--tx3)',marginBottom:20}}>
        {result.score} من {result.totalPoints} نقطة — {fmt(seconds)}
      </p>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
        <button onClick={handleRetry} className="btn btn-outline btn-md"><RotateCcw size={14}/>إعادة المحاولة</button>
        <button onClick={onClose} className="btn-register btn-md" style={{padding:'9px 20px'}}>متابعة الدرس</button>
      </div>
      {leaderboard.length > 0 && (
        <div style={{marginTop:24,textAlign:'right'}}>
          <h4 style={{fontSize:14,fontWeight:700,color:'var(--tx1)',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
            <Award size={15} style={{color:'var(--warn)'}}/>المتصدرون
          </h4>
          {leaderboard.slice(0,5).map((e:any,i:number) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',borderRadius:8,background:i===0?'var(--warn-bg)':'var(--surface2)',marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--tx1)'}}>{i+1}. {e.profiles?.full_name||'طالب'}</span>
              <span style={{fontSize:13,fontWeight:700,color:'var(--alpha-green)'}}>{Math.round((e.score/e.total_points)*100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div style={{padding:'20px 18px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <span style={{fontSize:12,fontWeight:600,color:'var(--tx3)'}}>
          السؤال {current+1} من {questions.length}
        </span>
        <span style={{display:'flex',alignItems:'center',gap:5,fontSize:13,fontWeight:700,color:'var(--tx2)'}}>
          <Clock size={13}/>{fmt(seconds)}
        </span>
      </div>

      <div style={{height:4,borderRadius:99,background:'var(--surface3)',marginBottom:20,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:99,background:'var(--alpha-green)',width:`${((current+1)/questions.length)*100}%`,transition:'width .3s'}}/>
      </div>

      <p style={{fontSize:16,fontWeight:700,color:'var(--tx1)',lineHeight:1.7,marginBottom:18}}>{q.question}</p>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {OPTIONS.map(({key,label}) => {
          const val = q[`option_${key}` as keyof Question] as string
          const sel = answers[q.id] === key
          const correct = result && correctMap[q.id]
          return (
            <button key={key} onClick={() => handleSelect(q.id, key)}
              style={{width:'100%',textAlign:'right',padding:'12px 16px',borderRadius:10,cursor:result?'default':'pointer',fontFamily:'inherit',fontSize:14,transition:'all .15s',display:'flex',alignItems:'center',gap:10,
                border:`1.5px solid ${sel?'var(--alpha-green)':'var(--brd)'}`,
                background:sel?'var(--alpha-green-l)':'var(--surface)',
                color:'var(--tx1)',fontWeight:sel?700:400}}>
              <span style={{width:26,height:26,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flexShrink:0,
                background:sel?'var(--alpha-green)':'var(--surface2)',color:sel?'#fff':'var(--tx3)'}}>
                {label}
              </span>
              {val}
            </button>
          )
        })}
      </div>

      <div style={{display:'flex',gap:10,justifyContent:'space-between'}}>
        <button onClick={()=>setCurrent(p=>Math.max(0,p-1))} disabled={current===0} className="btn btn-outline btn-md">السابق</button>
        {current < questions.length-1
          ? <button onClick={()=>setCurrent(p=>p+1)} className="btn-register btn-md" style={{padding:'9px 20px'}}>التالي</button>
          : <button onClick={handleSubmit} disabled={submitting} className="btn-register btn-md" style={{padding:'9px 20px'}}>
              {submitting?<><Loader2 size={13} className="spin"/>جاري التسليم...</>:'تسليم الإجابات'}
            </button>}
      </div>
    </div>
  )
}
