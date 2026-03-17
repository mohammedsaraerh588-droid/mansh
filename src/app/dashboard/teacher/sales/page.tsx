'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { TrendingUp, DollarSign, FileText, Users, Loader2 } from 'lucide-react'

export default function TeacherSalesPage() {
  const [sales,       setSales]       = useState<any[]>([])
  const [courseStats, setCourseStats] = useState<any[]>([])
  const [totalRev,    setTotalRev]    = useState(0)
  const [loading,     setLoading]     = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:courses } = await supabase.from('courses').select('id,title,price,currency').eq('teacher_id',session.user.id)
      if (!courses) { setLoading(false); return }

      const { data:enrollments } = await supabase.from('enrollments')
        .select('id,course_id,amount_paid,currency,enrolled_at,payment_status,profiles(full_name)')
        .in('course_id', courses.map((c:any)=>c.id))
        .eq('payment_status','completed')

      const statsMap: Record<string,any> = {}
      courses.forEach((c:any)=>{ statsMap[c.id]={ id:c.id, title:c.title, revenue:0, students:0, currency:c.currency||'USD' } })

      const processed: any[] = []
      let total = 0
      ;(enrollments||[]).forEach((e:any)=>{
        processed.push({ id:e.id, student:e.profiles?.full_name||'—', amount:e.amount_paid||0, currency:e.currency||'USD', date:e.enrolled_at, course:courses.find((c:any)=>c.id===e.course_id)?.title||'—' })
        if (statsMap[e.course_id]) { statsMap[e.course_id].revenue+=e.amount_paid||0; statsMap[e.course_id].students++ }
        total += e.amount_paid||0
      })

      setSales(processed); setCourseStats(Object.values(statsMap)); setTotalRev(total); setLoading(false)
    })()
  },[])

  const fmt = (n:number,c='USD') => new Intl.NumberFormat('ar-SA',{style:'currency',currency:c,minimumFractionDigits:0}).format(n)
  const fdate = (d:string) => new Date(d).toLocaleDateString('ar-SA',{year:'numeric',month:'short',day:'numeric'})

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--gold)'}}/></div>

  const cards = [
    {label:'إجمالي الإيرادات', value:fmt(totalRev),              Icon:TrendingUp, bg:'#fdf8ee', ic:'var(--gold)'},
    {label:'عدد المبيعات',     value:sales.length,               Icon:FileText,  bg:'#eff6ff', ic:'#2563eb'},
    {label:'متوسط المبيعة',    value:sales.length?fmt(totalRev/sales.length):'—', Icon:DollarSign, bg:'#f0fdf4', ic:'#15803d'},
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <span className="eyebrow">المبيعات</span>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)'}}>المبيعات والإيرادات</h1>
        <p style={{fontSize:14,color:'var(--txt2)',marginTop:4}}>نظرة شاملة على جميع مبيعاتك وإيراداتك</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14}}>
        {cards.map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="sc" style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={20} style={{color:ic}}/></div>
            <div>
              <div style={{fontSize:12,color:'var(--txt2)',marginBottom:3}}>{label}</div>
              <div style={{fontSize:20,fontWeight:900,color:'var(--txt1)'}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {courseStats.length>0 && (
        <div className="card" style={{padding:22}}>
          <h2 style={{fontSize:16,fontWeight:900,color:'var(--txt1)',marginBottom:16,display:'flex',alignItems:'center',gap:8}}><TrendingUp size={16} style={{color:'var(--gold)'}}/>إحصائيات الدورات</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
            {courseStats.map((s:any,i:number)=>(
              <div key={i} style={{padding:'14px 16px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg)'}}>
                <h3 style={{fontWeight:700,fontSize:14,marginBottom:10,color:'var(--txt1)'}}>{s.title}</h3>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}>
                  <span style={{color:'var(--txt2)'}}>الإيرادات</span>
                  <span style={{fontWeight:800,color:'var(--gold)'}}>{fmt(s.revenue,s.currency)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'var(--txt2)'}}>الطلاب</span>
                  <span style={{fontWeight:700,color:'var(--txt1)',display:'flex',alignItems:'center',gap:4}}><Users size={12}/>{s.students}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sales.length>0 ? (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
            <FileText size={16} style={{color:'var(--gold)'}}/><h2 style={{fontSize:16,fontWeight:900,color:'var(--txt1)'}}>قائمة المبيعات</h2>
          </div>
          <table className="tbl">
            <thead><tr><th>الطالب</th><th>الدورة</th><th style={{textAlign:'center'}}>المبلغ</th><th style={{textAlign:'center'}}>التاريخ</th><th style={{textAlign:'center'}}>الحالة</th></tr></thead>
            <tbody>
              {sales.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.student}</td>
                  <td style={{color:'var(--txt2)'}}>{s.course}</td>
                  <td style={{textAlign:'center',fontWeight:800,color:'var(--gold)'}}>{fmt(s.amount,s.currency)}</td>
                  <td style={{textAlign:'center',color:'var(--txt3)'}}>{fdate(s.date)}</td>
                  <td style={{textAlign:'center'}}><span className="badge bg-green">مكتمل</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><DollarSign size={24} style={{color:'var(--txt3)'}}/></div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد مبيعات حتى الآن</h3>
          <p style={{color:'var(--txt2)',fontSize:14}}>ابدأ بإنشاء دورات لجني الأرباح.</p>
        </div>
      )}
    </div>
  )
}
