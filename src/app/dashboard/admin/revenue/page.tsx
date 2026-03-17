'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { DollarSign, TrendingUp, Users, Award, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminRevenuePage() {
  const [loading, setLoading]     = useState(true)
  const [revenue, setRevenue]     = useState(0)
  const [enrollments, setEnrollments] = useState(0)
  const [topCourses, setTopCourses]   = useState<any[]>([])
  const [chartData, setChartData]     = useState<any[]>([])
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetch = async () => {
      // total revenue from payments
      const { data: payments } = await supabase
        .from('enrollments')
        .select('amount_paid, enrolled_at, courses(title, price)')
        .eq('payment_status', 'completed')

      const totalRev = (payments || []).reduce((s: number, p: any) => s + (p.amount_paid || 0), 0)
      setRevenue(totalRev)
      setEnrollments((payments || []).length)

      // Top courses by revenue
      const courseMap: Record<string, {title:string, revenue:number, students:number}> = {}
      ;(payments || []).forEach((p: any) => {
        const t = p.courses?.title || 'غير معروف'
        if (!courseMap[t]) courseMap[t] = { title: t, revenue: 0, students: 0 }
        courseMap[t].revenue  += p.amount_paid || 0
        courseMap[t].students += 1
      })
      const top = Object.values(courseMap).sort((a,b) => b.revenue - a.revenue).slice(0,5)
      setTopCourses(top)

      // Monthly chart (last 6 months)
      const months: Record<string, number> = {}
      ;(payments || []).forEach((p: any) => {
        if (!p.enrolled_at) return
        const m = new Date(p.enrolled_at).toLocaleDateString('ar-SA',{month:'short', year:'2-digit'})
        months[m] = (months[m] || 0) + (p.amount_paid || 0)
      })
      const chart = Object.entries(months).slice(-6).map(([month, value]) => ({ month, value }))
      setChartData(chart)
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-1" style={{color:'var(--text-primary)'}}>تقارير الإيرادات</h1>
        <p className="text-sm" style={{color:'var(--text-secondary)'}}>نظرة شاملة على إيرادات المنصة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'إجمالي الإيرادات',    value: formatPrice(revenue),     icon: DollarSign, bg:'#faf6ec', color:'var(--gold-dark)' },
          { label:'عمليات الشراء',        value: enrollments,              icon: TrendingUp, bg:'#eff6ff', color:'#2563eb' },
          { label:'متوسط قيمة الطلب',    value: enrollments ? formatPrice(revenue/enrollments) : '—', icon: Award, bg:'#f0fdf4', color:'#059669' },
          { label:'أفضل دورة إيراداً',   value: topCourses[0]?.title?.slice(0,20)+'...' || '—', icon: Users, bg:'#faf5ff', color:'#7c3aed' },
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:s.bg}}>
                <s.icon className="w-5 h-5" style={{color:s.color}} />
              </div>
              <span className="text-xs font-bold" style={{color:'var(--text-secondary)'}}>{s.label}</span>
            </div>
            <div className="text-2xl font-black" style={{color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-black mb-6" style={{color:'var(--text-primary)'}}>الإيرادات الشهرية</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{fontSize:12, fill:'var(--text-muted)'}} />
              <YAxis tick={{fontSize:12, fill:'var(--text-muted)'}} />
              <Tooltip formatter={(v:any)=>formatPrice(v)} contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8}} />
              <Bar dataKey="value" fill="var(--gold)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top courses */}
      {topCourses.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b" style={{borderColor:'var(--border)'}}>
            <h2 className="text-lg font-black" style={{color:'var(--text-primary)'}}>أعلى الدورات إيراداً</h2>
          </div>
          <table className="data-table">
            <thead><tr><th>الدورة</th><th className="text-center">الطلاب</th><th className="text-left">الإيراد</th></tr></thead>
            <tbody>
              {topCourses.map((c,i)=>(
                <tr key={i}>
                  <td className="font-bold" style={{color:'var(--text-primary)'}}>{c.title}</td>
                  <td className="text-center" style={{color:'var(--text-secondary)'}}>{c.students}</td>
                  <td className="text-left font-black" style={{color:'var(--gold-dark)'}}>{formatPrice(c.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
