'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Users, BookOpen, DollarSign, Award, TrendingUp, ShieldCheck, Tag, Loader2, UserCheck, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ users:0, students:0, teachers:0, courses:0, published:0, pending:0, revenue:0, certs:0 })
  const [recent,  setRecent]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const [
        { count: users },
        { count: students },
        { count: teachers },
        { count: courses },
        { count: published },
        { count: pending },
        { count: certs },
        { data: enrollData },
        { data: recentUsers },
      ] = await Promise.all([
        supabase.from('profiles').select('*',{count:'exact',head:true}),
        supabase.from('profiles').select('*',{count:'exact',head:true}).eq('role','student'),
        supabase.from('profiles').select('*',{count:'exact',head:true}).eq('role','teacher'),
        supabase.from('courses').select('*',{count:'exact',head:true}),
        supabase.from('courses').select('*',{count:'exact',head:true}).eq('status','published'),
        supabase.from('courses').select('*',{count:'exact',head:true}).eq('status','pending'),
        supabase.from('certificates').select('*',{count:'exact',head:true}),
        supabase.from('enrollments').select('amount_paid').eq('payment_status','completed'),
        supabase.from('profiles').select('id,full_name,email,role,created_at').order('created_at',{ascending:false}).limit(6),
      ])
      const revenue = enrollData?.reduce((s:number,e:any)=>s+(e.amount_paid||0),0)||0
      setStats({ users:users||0, students:students||0, teachers:teachers||0, courses:courses||0, published:published||0, pending:pending||0, revenue, certs:certs||0 })
      setRecent(recentUsers||[])
      setLoading(false)
    })()
  },[])

  const fmt = (n:number) => new Intl.NumberFormat('ar-SA',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(n)
  const roleLabel = (r:string) => ({admin:'مدير',teacher:'معلم',student:'طالب'}[r]||r)
  const roleBadge = (r:string) => ({admin:'badge-red',teacher:'badge-teal',student:'badge-gray'}[r]||'badge-gray')

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--alpha-green)'}}/></div>

  const STATS = [
    { label:'إجمالي المستخدمين', value:stats.users,     Icon:Users,      color:'#E3F2FD', ic:'#1565C0',         href:'/dashboard/admin/users' },
    { label:'الطلاب',            value:stats.students,   Icon:UserCheck,  color:'#E8F5E9', ic:'var(--alpha-green)', href:'/dashboard/admin/users' },
    { label:'المعلمون',          value:stats.teachers,   Icon:ShieldCheck,color:'#E8EAF6', ic:'#3949AB',         href:'/dashboard/admin/users' },
    { label:'الدورات المنشورة',  value:stats.published,  Icon:BookOpen,   color:'#F3E5F5', ic:'#7B1FA2',         href:'/dashboard/admin/courses' },
    { label:'قيد المراجعة',      value:stats.pending,    Icon:Clock,      color:'#FFF3E0', ic:'#F57F17',         href:'/dashboard/admin/courses' },
    { label:'الشهادات الصادرة',  value:stats.certs,      Icon:Award,      color:'#FCE4EC', ic:'#C62828',         href:'/dashboard/admin/users' },
    { label:'إجمالي الإيرادات',  value:fmt(stats.revenue),Icon:DollarSign,color:'#E8F5E9', ic:'var(--alpha-green)', href:'/dashboard/admin/revenue' },
    { label:'إجمالي الدورات',   value:stats.courses,    Icon:TrendingUp, color:'#E0F2F1', ic:'#00695C',         href:'/dashboard/admin/courses' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#1B5E20,#2E7D32)',borderRadius:16,padding:'24px 28px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,left:-20,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,.05)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.6)',marginBottom:4}}>لوحة الإدارة</p>
          <h1 style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-.02em'}}>مرحباً بك في لوحة التحكم</h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.6)',marginTop:4}}>إدارة شاملة لجميع عمليات المنصة</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14}}>
        {STATS.map(({label,value,Icon,color,ic,href},i)=>(
          <Link key={i} href={href} style={{textDecoration:'none'}}>
            <div className="stat-card" style={{cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:12,color:'var(--tx3)',fontWeight:600}}>{label}</span>
                <div style={{width:34,height:34,borderRadius:9,background:color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon size={15} style={{color:ic}}/>
                </div>
              </div>
              <div style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{fontSize:15,fontWeight:800,color:'var(--tx1)',marginBottom:14}}>إجراءات سريعة</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          {[
            { label:'إدارة المستخدمين وتعيين المعلمين', href:'/dashboard/admin/users',   Icon:Users,       color:'var(--alpha-green)' },
            { label:'مراجعة الدورات والموافقة عليها',   href:'/dashboard/admin/courses', Icon:ShieldCheck, color:'#7B1FA2' },
            { label:'إنشاء كوبونات خصم',                href:'/dashboard/admin/coupons', Icon:Tag,         color:'#F57F17' },
            { label:'تقارير الإيرادات',                  href:'/dashboard/admin/revenue', Icon:DollarSign,  color:'#1565C0' },
          ].map(({label,href,Icon,color},i)=>(
            <Link key={i} href={href} style={{textDecoration:'none'}}>
              <div className="card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',transition:'all .2s'}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--alpha-green-m)';el.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--brd)';el.style.transform='none'}}>
                <div style={{width:38,height:38,borderRadius:10,background:color+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon size={16} style={{color}}/>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:'var(--tx1)',lineHeight:1.4}}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent users */}
      {recent.length > 0 && (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--brd)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{fontSize:15,fontWeight:800,color:'var(--tx1)'}}>آخر المسجّلين</h2>
            <Link href="/dashboard/admin/users" style={{fontSize:13,color:'var(--alpha-green)',fontWeight:700,textDecoration:'none'}}>عرض الكل</Link>
          </div>
          <table className="tbl">
            <thead><tr><th>المستخدم</th><th>البريد</th><th>الصلاحية</th><th>تاريخ التسجيل</th></tr></thead>
            <tbody>
              {recent.map(u=>(
                <tr key={u.id}>
                  <td style={{fontWeight:600,color:'var(--tx1)'}}>{u.full_name||'—'}</td>
                  <td style={{fontSize:12,color:'var(--tx3)'}}>{u.email}</td>
                  <td><span className={`badge ${roleBadge(u.role)}`}>{roleLabel(u.role)}</span></td>
                  <td style={{fontSize:12,color:'var(--tx3)'}}>{new Date(u.created_at).toLocaleDateString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
