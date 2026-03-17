'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Users, Video, DollarSign, Award, Loader2, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats,   setStats]   = useState({ users:0, courses:0, revenue:0, certs:0 })
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data:p } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(p)
      if (p?.role!=='admin') { window.location.href='/dashboard/student'; return }
      const [{ count:uc },{ count:cc },{ count:cert }] = await Promise.all([
        supabase.from('profiles').select('*',{count:'exact',head:true}),
        supabase.from('courses').select('*',{count:'exact',head:true}),
        supabase.from('certificates').select('*',{count:'exact',head:true}),
      ])
      const { data:cs } = await supabase.from('courses').select('total_students,price')
      let rev=0; cs?.forEach(c=>rev+=(c.total_students||0)*(c.price||0))
      setStats({ users:uc||0, courses:cc||0, revenue:rev, certs:cert||0 })
      const { data:us } = await supabase.from('profiles').select('id,full_name,email,role,created_at').order('created_at',{ascending:false}).limit(7)
      setUsers(us||[])
      setLoading(false)
    })()
  },[])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  const cards = [
    { label:'المستخدمون', value:stats.users,                Icon:Users,     bg:'#faf6ec', ic:'var(--gold)' },
    { label:'الدورات',    value:stats.courses,              Icon:Video,     bg:'#eff6ff', ic:'#2563eb'     },
    { label:'الإيرادات',  value:formatPrice(stats.revenue), Icon:DollarSign,bg:'#f0fdf4', ic:'#16a34a'     },
    { label:'الشهادات',   value:stats.certs,                Icon:Award,     bg:'#faf5ff', ic:'#7c3aed'     },
  ]
  const roleLabel = (r:string) => r==='admin'?'مدير':r==='teacher'?'معلم':'طالب'
  const roleBadge = (r:string) => r==='admin'?'badge-red':r==='teacher'?'badge-navy':'badge-gray'

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>لوحة الإدارة</p>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>نظرة عامة على المنصة</h1>
        <p style={{fontSize:14,color:'var(--txt2)'}}>مرحباً {profile?.full_name}، إليك إحصائياتك.</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:14}}>
        {cards.map(({label,value,Icon,bg,ic},i)=>(
          <div key={i} className="stat-card">
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon size={18} style={{color:ic}}/>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:'var(--txt2)'}}>{label}</span>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:'var(--txt1)'}}>{value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{fontSize:16,fontWeight:900,color:'var(--txt1)',display:'flex',alignItems:'center',gap:8}}><Users size={16} style={{color:'var(--gold)'}}/>أحدث المستخدمين</h2>
          <Link href="/dashboard/admin/users" style={{fontSize:13,fontWeight:700,color:'var(--gold)',textDecoration:'none'}}>إدارة الكل</Link>
        </div>
        <div style={{padding:'8px 12px',display:'flex',flexDirection:'column',gap:4}}>
          {users.map(u=>(
            <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 10px',borderRadius:10,transition:'background .15s',cursor:'default'}}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--bg2)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:'var(--txt1)'}}>{u.full_name||'بدون اسم'}</span>
                  <span className={`badge ${roleBadge(u.role)}`} style={{fontSize:10}}>{roleLabel(u.role)}</span>
                </div>
                <span style={{fontSize:12.5,color:'var(--txt3)'}}>{u.email}</span>
              </div>
              <ArrowUpRight size={15} style={{color:'var(--txt3)'}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
