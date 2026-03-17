'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Users, Video, DollarSign, Award, ArrowUpRight, Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ users:0, courses:0, revenue:0, certs:0 })
  const [recentUsers, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(p)
      if (p?.role !== 'admin') { window.location.href = '/dashboard/student'; return }
      const { count: uc } = await supabase.from('profiles').select('*', { count:'exact', head:true })
      const { count: cc } = await supabase.from('courses').select('*', { count:'exact', head:true })
      const { count: cert } = await supabase.from('certificates').select('*', { count:'exact', head:true })
      const { data: cs } = await supabase.from('courses').select('total_students, price')
      let rev = 0; cs?.forEach(c => rev += (c.total_students||0)*(c.price||0))
      setStats({ users:uc||0, courses:cc||0, revenue:rev, certs:cert||0 })
      const { data: us } = await supabase.from('profiles').select('id,full_name,email,role,created_at').order('created_at',{ascending:false}).limit(6)
      setUsers(us||[])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
    </div>
  )

  const cards = [
    { label:'المستخدمون',   value: stats.users,               icon: Users,     bg:'#faf6ec', color:'var(--gold-dark)' },
    { label:'الدورات',      value: stats.courses,             icon: Video,     bg:'#eff6ff', color:'#2563eb' },
    { label:'الإيرادات',   value: formatPrice(stats.revenue), icon: DollarSign,bg:'#f0fdf4', color:'#059669' },
    { label:'الشهادات',    value: stats.certs,                icon: Award,     bg:'#faf5ff', color:'#7c3aed' },
  ]

  const roleLabel = (r:string) => r==='admin'?'مدير':r==='teacher'?'معلم':'طالب'
  const roleBg    = (r:string) => r==='admin'?{bg:'#fef2f2',color:'#dc2626'}:r==='teacher'?{bg:'#eff6ff',color:'#2563eb'}:{bg:'var(--surface-3)',color:'var(--text-secondary)'}

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-black tracking-widest uppercase mb-1" style={{color:'var(--gold)',letterSpacing:'0.15em'}}>لوحة الإدارة</p>
        <h1 className="text-3xl font-black" style={{color:'var(--text-primary)'}}>نظرة عامة على المنصة</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>مرحباً {profile?.full_name}، إليك إحصائياتك الشاملة.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s,i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:s.bg}}>
                <s.icon className="w-5 h-5" style={{color:s.color}} />
              </div>
              <span className="text-xs font-bold" style={{color:'var(--text-secondary)'}}>{s.label}</span>
            </div>
            <div className="text-3xl font-black" style={{color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between" style={{borderColor:'var(--border)'}}>
          <h2 className="text-lg font-black flex items-center gap-2" style={{color:'var(--text-primary)'}}>
            <Users className="w-5 h-5" style={{color:'var(--gold)'}} /> أحدث المستخدمين
          </h2>
          <Link href="/dashboard/admin/users" className="text-sm font-bold" style={{color:'var(--gold-dark)'}}>إدارة المستخدمين</Link>
        </div>
        <div className="p-4 space-y-2">
          {recentUsers.map(u => {
            const rb = roleBg(u.role)
            return (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl transition-all" style={{border:'1px solid var(--border)'}}
                onMouseEnter={e=>(e.currentTarget.style.background='var(--surface-2)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <div>
                  <div className="font-bold flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                    {u.full_name || 'بدون اسم'}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black" style={{background:rb.bg, color:rb.color}}>{roleLabel(u.role)}</span>
                  </div>
                  <div className="text-sm" style={{color:'var(--text-secondary)'}}>{u.email}</div>
                </div>
                <ArrowUpRight className="w-4 h-4" style={{color:'var(--text-muted)'}} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
