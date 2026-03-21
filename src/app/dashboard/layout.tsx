'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, BookOpen, Award, Video, BarChart, FileText,
         Settings, Users, LogOut, Loader2, Heart } from 'lucide-react'
import NotificationBell from '@/components/ui/NotificationBell'

const NAV = {
  student: [
    { label:'لوحتي',       href:'/dashboard/student',              Icon:LayoutDashboard },
    { label:'دوراتي',      href:'/dashboard/student/courses',      Icon:BookOpen },
    { label:'شهاداتي',     href:'/dashboard/student/certificates', Icon:Award },
    { label:'المفضلة',     href:'/dashboard/student/wishlist',     Icon:Heart },
  ],
  teacher: [
    { label:'لوحة التحكم',   href:'/dashboard/teacher',         Icon:LayoutDashboard },
    { label:'إدارة الدورات', href:'/dashboard/teacher/courses', Icon:Video },
    { label:'المبيعات',      href:'/dashboard/teacher/sales',   Icon:BarChart },
    { label:'الاختبارات',    href:'/dashboard/teacher/quizzes', Icon:FileText },
  ],
  admin: [
    { label:'نظرة عامة',  href:'/dashboard/admin',         Icon:LayoutDashboard },
    { label:'المستخدمون', href:'/dashboard/admin/users',   Icon:Users },
    { label:'الإيرادات',  href:'/dashboard/admin/revenue', Icon:BarChart },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role,    setRole]    = useState<'student'|'teacher'|'admin'|null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/auth/login'; return }
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => {
          setProfile(data)
          setRole((data?.role as any) ?? 'student')
          setLoading(false)
        })
    })
  }, [])

  if (loading) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Loader2 size={32} className="spin" style={{color:'var(--brand)'}}/>
    </div>
  )

  const items = role ? NAV[role] : []
  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href + '/') && href.split('/').length > 3)

  return (
    <div style={{maxWidth:1280, margin:'0 auto', padding:'32px 20px'}}>
      <div style={{display:'flex', gap:28, alignItems:'flex-start'}}>

        {/* Sidebar */}
        <aside style={{width:230, flexShrink:0, position:'sticky', top:90}}>
          <div className="card" style={{padding:12, marginBottom:12}}>
            {/* Profile mini */}
            <div style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px 12px', borderBottom:'1px solid var(--brd)', marginBottom:8}}>
              <div style={{width:36, height:36, borderRadius:'50%', background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', overflow:'hidden', flexShrink:0}}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : (profile?.full_name?.[0] || 'ط')}
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13, fontWeight:700, color:'var(--tx1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{profile?.full_name || 'مستخدم'}</div>
                <div style={{fontSize:10, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:1}}>
                  {role === 'admin' ? 'مدير' : role === 'teacher' ? 'معلم' : 'طالب'}
                </div>
              </div>
              <NotificationBell />
            </div>

            <p style={{fontSize:10, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--tx4)', padding:'2px 10px 8px'}}>
              القائمة
            </p>
            <nav style={{display:'flex', flexDirection:'column', gap:2}}>
              {items.map(({label, href, Icon}) => (
                <Link key={href} href={href}
                  className={`nav-link ${isActive(href) ? 'active' : ''}`}
                  style={{textDecoration:'none'}}>
                  <Icon size={15}/>{label}
                </Link>
              ))}
              <div style={{height:1, background:'var(--brd)', margin:'8px 4px'}}/>
              <Link href="/profile"
                className={`nav-link ${pathname==='/profile' ? 'active' : ''}`}
                style={{textDecoration:'none'}}>
                <Settings size={15}/>الحساب
              </Link>
              <button className="nav-link danger"
                style={{background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'right', fontFamily:'inherit'}}
                onClick={async () => { await supabase.auth.signOut(); window.location.href='/' }}>
                <LogOut size={15}/>خروج
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main style={{flex:1, minWidth:0}} className="fade-up">
          {children}
        </main>
      </div>
    </div>
  )
}
