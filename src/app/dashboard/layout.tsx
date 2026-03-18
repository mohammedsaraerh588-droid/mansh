'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, BookOpen, Award, Video, BarChart, FileText, Settings, Users, LogOut, Loader2 } from 'lucide-react'

const NAV = {
  student: [
    { label:'لوحتي',    href:'/dashboard/student',              Icon:LayoutDashboard },
    { label:'دوراتي',   href:'/dashboard/student/courses',      Icon:BookOpen },
    { label:'شهاداتي',  href:'/dashboard/student/certificates', Icon:Award },
  ],
  teacher: [
    { label:'لوحة التحكم',         href:'/dashboard/teacher',              Icon:LayoutDashboard },
    { label:'إدارة الدورات',       href:'/dashboard/teacher/courses',      Icon:Video },
    { label:'المبيعات',            href:'/dashboard/teacher/sales',        Icon:BarChart },
    { label:'الاختبارات',          href:'/dashboard/teacher/quizzes',      Icon:FileText },
  ],
  admin: [
    { label:'نظرة عامة',           href:'/dashboard/admin',                Icon:LayoutDashboard },
    { label:'المستخدمون',          href:'/dashboard/admin/users',          Icon:Users },
    { label:'الإيرادات',           href:'/dashboard/admin/revenue',        Icon:BarChart },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role,    setRole]    = useState<'student'|'teacher'|'admin'|null>(null)
  const [loading, setLoading] = useState(true)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/auth/login'; return }
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => { setRole((data?.role as any) ?? 'student'); setLoading(false) })
    })
  }, [])

  if (loading) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Loader2 size={32} className="spin" style={{color:'var(--teal)'}}/>
    </div>
  )

  const items = role ? NAV[role] : []

  return (
    <div style={{maxWidth:1280,margin:'0 auto',padding:'32px 20px'}}>
      <div style={{display:'flex',gap:28,alignItems:'flex-start'}}>

        {/* Sidebar */}
        <aside style={{width:220,flexShrink:0,position:'sticky',top:90}}>
          <div className="card" style={{padding:12}}>
            <p style={{fontSize:10,fontWeight:800,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--txt3)',padding:'4px 10px 10px'}}>القائمة</p>
            <nav style={{display:'flex',flexDirection:'column',gap:2}}>
              {items.map(({label,href,Icon})=>(
                <Link key={href} href={href} className={`nav-link ${pathname===href?'active':''}`} style={{textDecoration:'none'}}>
                  <Icon size={16}/>{label}
                </Link>
              ))}
              <div style={{height:1,background:'var(--border)',margin:'8px 4px'}}/>
              <Link href="/profile" className={`nav-link ${pathname==='/profile'?'active':''}`} style={{textDecoration:'none'}}>
                <Settings size={16}/>إعدادات الحساب
              </Link>
              <button className="nav-link danger" style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}
                onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}>
                <LogOut size={16}/>تسجيل الخروج
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main style={{flex:1,minWidth:0}} className="fade-up">{children}</main>
      </div>
    </div>
  )
}
