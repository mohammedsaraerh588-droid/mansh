'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DollarSign, TrendingUp, Users, Award, Loader2 } from 'lucide-react'

export default function AdminRevenuePage() {
  const [loading,     setLoading]    = useState(true)
  const [revenue,     setRevenue]    = useState(0)
  const [count,       setCount]      = useState(0)
  const [topCourses,  setTopCourses] = useState<any[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('enrollments')
        .select('amount_paid,enrolled_at,courses(title)')
        .eq('payment_status','completed')
      if (!data) { setLoading(false); return }
      const rev = data.reduce((s:number,p:any)=>s+(p.amount_paid||0),0)
      setRevenue(rev); setCount(data.length)
      const map:any={}
      data.forEach((p:any)=>{ const t=p.courses?.title||'—'; if(!map[t])map[t]={title:t,revenue:0,students:0}; map[t].revenue+=p.amount_paid||0; map[t].students++ })
      setTopCourses(Object.values(map).sort((a:any,b:any)=>b.revenue-a.revenue).slice(0,8))
      setLoading(false)
    })()
  },[])

  const fmt=(n:number)=>new Intl.NumberFormat('ar-SA',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(n)

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--teal)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--teal)',marginBottom:5}}>المالية</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--txt1)'}}>تقارير الإيرادات</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:14}}>
        {[
          {label:'إجمالي الإيرادات', value:fmt(revenue),                  Icon:TrendingUp, bg:'var(--teal-soft)', ic:'var(--teal)'},
          {label:'عمليات الشراء',    value:count,                          Icon:DollarSign, bg:'#eff6ff',         ic:'#2563eb'},
          {label:'متوسط الطلب',      value:count?fmt(revenue/count):'—',  Icon:Award,      bg:'var(--ok-bg)',    ic:'var(--ok)'},
          {label:'أفضل دورة',        value:topCourses[0]?.students||0,     Icon:Users,      bg:'var(--pur-bg)',   ic:'var(--purple)'},
        ].map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="stat-card" style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={20} style={{color:ic}}/></div>
            <div><div style={{fontSize:12,color:'var(--txt2)',marginBottom:2}}>{label}</div><div style={{fontSize:20,fontWeight:900,color:'var(--txt1)'}}>{value}</div></div>
          </div>
        ))}
      </div>

      {topCourses.length>0 && (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--border)'}}>
            <h2 style={{fontSize:15,fontWeight:900,color:'var(--txt1)'}}>أعلى الدورات إيراداً</h2>
          </div>
          <table className="tbl">
            <thead><tr><th>#</th><th>الدورة</th><th style={{textAlign:'center'}}>الطلاب</th><th style={{textAlign:'left'}}>الإيراد</th></tr></thead>
            <tbody>
              {topCourses.map((c:any,i:number)=>(
                <tr key={i}>
                  <td style={{color:'var(--txt3)',fontWeight:700,width:40}}>{i+1}</td>
                  <td style={{fontWeight:700}}>{c.title}</td>
                  <td style={{textAlign:'center',color:'var(--txt2)'}}>{c.students}</td>
                  <td style={{textAlign:'left',fontWeight:900,color:'var(--teal)'}}>{fmt(c.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topCourses.length===0 && (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--teal-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}><DollarSign size={24} style={{color:'var(--teal)'}}/></div>
          <h3 style={{fontSize:17,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لا توجد إيرادات بعد</h3>
          <p style={{color:'var(--txt2)',fontSize:14}}>ستظهر الإيرادات هنا عند إتمام عمليات الشراء.</p>
        </div>
      )}
    </div>
  )
}
