'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { TrendingUp, DollarSign, FileText, Users, Loader2 } from 'lucide-react'

export default function TeacherSalesPage() {
  const [sales,    setSales]    = useState<any[]>([])
  const [stats,    setStats]    = useState<any[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:courses } = await supabase.from('courses').select('id,title,price,currency').eq('teacher_id',session.user.id)
      if (!courses?.length) { setLoading(false); return }
      const { data:enrollments } = await supabase.from('enrollments')
        .select('id,course_id,amount_paid,currency,enrolled_at,payment_status,profiles(full_name)')
        .in('course_id',courses.map((c:any)=>c.id)).eq('payment_status','completed')
      const map:any = {}
      courses.forEach((c:any)=>{ map[c.id]={ title:c.title, revenue:0, students:0 } })
      let rev=0
      const list:any[]=[]
      ;(enrollments||[]).forEach((e:any)=>{
        list.push({ id:e.id, student:e.profiles?.full_name||'—', amount:e.amount_paid||0, date:e.enrolled_at, course:courses.find((c:any)=>c.id===e.course_id)?.title||'—' })
        if (map[e.course_id]) { map[e.course_id].revenue+=e.amount_paid||0; map[e.course_id].students++ }
        rev+=e.amount_paid||0
      })
      setSales(list); setStats(Object.values(map)); setTotal(rev); setLoading(false)
    })()
  },[])

  const fmt  = (n:number) => new Intl.NumberFormat('ar-SA',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(n)
  const fdate= (d:string) => new Date(d).toLocaleDateString('ar-SA',{year:'numeric',month:'short',day:'numeric'})

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--teal)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--teal)',marginBottom:5}}>التقارير المالية</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--txt1)'}}>المبيعات والإيرادات</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:14}}>
        {[
          {label:'إجمالي الإيرادات', value:fmt(total),                              Icon:TrendingUp, bg:'var(--teal-soft)',   ic:'var(--teal)'},
          {label:'عدد المبيعات',     value:sales.length,                            Icon:FileText,   bg:'#eff6ff',            ic:'#2563eb'},
          {label:'متوسط المبيعة',    value:sales.length?fmt(total/sales.length):'—',Icon:DollarSign, bg:'var(--ok-bg)',       ic:'var(--ok)'},
        ].map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="stat-card" style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={20} style={{color:ic}}/></div>
            <div><div style={{fontSize:12,color:'var(--txt2)',marginBottom:2}}>{label}</div><div style={{fontSize:20,fontWeight:900,color:'var(--txt1)'}}>{value}</div></div>
          </div>
        ))}
      </div>

      {stats.length>0 && (
        <div className="card" style={{padding:22}}>
          <h2 style={{fontSize:16,fontWeight:900,color:'var(--txt1)',marginBottom:16,display:'flex',alignItems:'center',gap:8}}><TrendingUp size={16} style={{color:'var(--teal)'}}/>إحصائيات الدورات</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {stats.map((s:any,i:number)=>(
              <div key={i} style={{padding:'14px 16px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg)'}}>
                <h3 style={{fontWeight:700,fontSize:13.5,marginBottom:10,color:'var(--txt1)'}}>{s.title}</h3>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}><span style={{color:'var(--txt2)'}}>الإيرادات</span><span style={{fontWeight:800,color:'var(--teal)'}}>{fmt(s.revenue)}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span style={{color:'var(--txt2)'}}>الطلاب</span><span style={{fontWeight:700,color:'var(--txt1)',display:'flex',alignItems:'center',gap:4}}><Users size={11}/>{s.students}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sales.length>0 ? (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
            <FileText size={15} style={{color:'var(--teal)'}}/><h2 style={{fontSize:15,fontWeight:900,color:'var(--txt1)'}}>قائمة المبيعات</h2>
          </div>
          <table className="tbl">
            <thead><tr><th>الطالب</th><th>الدورة</th><th style={{textAlign:'center'}}>المبلغ</th><th style={{textAlign:'center'}}>التاريخ</th></tr></thead>
            <tbody>
              {sales.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.student}</td>
                  <td style={{color:'var(--txt2)',fontSize:13}}>{s.course}</td>
                  <td style={{textAlign:'center',fontWeight:800,color:'var(--teal)'}}>{fmt(s.amount)}</td>
                  <td style={{textAlign:'center',color:'var(--txt3)',fontSize:12}}>{fdate(s.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--teal-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><DollarSign size={24} style={{color:'var(--teal)'}}/></div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد مبيعات حتى الآن</h3>
          <p style={{color:'var(--txt2)',fontSize:14}}>ابدأ بإضافة دورات مدفوعة لتظهر المبيعات هنا.</p>
        </div>
      )}
    </div>
  )
}
