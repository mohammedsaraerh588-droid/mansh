'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { DollarSign, TrendingUp, Users, Loader2 } from 'lucide-react'

export default function TeacherSalesPage() {
  const [loading,    setLoading]    = useState(true)
  const [revenue,    setRevenue]    = useState(0)
  const [count,      setCount]      = useState(0)
  const [topCourses, setTopCourses] = useState<any[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:courses } = await supabase.from('courses')
        .select('id').eq('teacher_id', session.user.id)
      if (!courses?.length) { setLoading(false); return }
      const ids = courses.map(c => c.id)
      const { data } = await supabase.from('enrollments')
        .select('amount_paid,enrolled_at,courses(title)')
        .in('course_id', ids).eq('payment_status', 'completed')
      if (data) {
        const rev = data.reduce((s:number,p:any) => s + (p.amount_paid||0), 0)
        setRevenue(rev); setCount(data.length)
        const map:any = {}
        data.forEach((p:any) => {
          const t = p.courses?.title || 'غير معروف'
          if (!map[t]) map[t] = { title:t, revenue:0, students:0 }
          map[t].revenue += p.amount_paid || 0
          map[t].students++
        })
        setTopCourses(Object.values(map).sort((a:any,b:any) => b.revenue - a.revenue).slice(0,8))
      }
      setLoading(false)
    })()
  }, [])

  const fmt = (n:number) => new Intl.NumberFormat('ar-SA',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(n)

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--alpha-green)'}}/></div>

  return (
    <div style={{display:'flex', flexDirection:'column', gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>المعلم</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>المبيعات والإيرادات</h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
        {[
          { label:'إجمالي الإيرادات', value:fmt(revenue),    Icon:DollarSign, color:'#E8F5E9', ic:'var(--alpha-green)' },
          { label:'عدد المبيعات',     value:count,            Icon:TrendingUp, color:'#E3F2FD', ic:'#1565C0' },
          { label:'متوسط البيع',      value:count>0?fmt(revenue/count):'—', Icon:Users, color:'#FFF8E1', ic:'#F57F17' },
        ].map(({label,value,Icon,color,ic},i) => (
          <div key={i} className="stat-card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:13,color:'var(--tx3)',fontWeight:600}}>{label}</span>
              <div style={{width:36,height:36,borderRadius:9,background:color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon size={16} style={{color:ic}}/>
              </div>
            </div>
            <div style={{fontSize:24,fontWeight:900,color:'var(--tx1)'}}>{value}</div>
          </div>
        ))}
      </div>

      {topCourses.length > 0 && (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--brd)'}}>
            <h2 style={{fontSize:16,fontWeight:800,color:'var(--tx1)'}}>أعلى الدورات مبيعاً</h2>
          </div>
          <table className="tbl">
            <thead><tr><th>الدورة</th><th>الطلاب</th><th>الإيرادات</th></tr></thead>
            <tbody>
              {topCourses.map((c:any,i) => (
                <tr key={i}>
                  <td style={{fontWeight:600,color:'var(--tx1)'}}>{c.title}</td>
                  <td>{c.students}</td>
                  <td style={{fontWeight:700,color:'var(--alpha-green)'}}>{fmt(c.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topCourses.length === 0 && (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <DollarSign size={36} style={{color:'var(--tx4)',margin:'0 auto 12px'}}/>
          <h3 style={{fontSize:16,fontWeight:700,color:'var(--tx1)',marginBottom:6}}>لا توجد مبيعات بعد</h3>
          <p style={{fontSize:14,color:'var(--tx3)'}}>ستظهر هنا مبيعاتك عند اشتراك الطلاب في دوراتك المدفوعة.</p>
        </div>
      )}
    </div>
  )
}
