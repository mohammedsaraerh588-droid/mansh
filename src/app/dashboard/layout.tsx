'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, BookOpen, Award, Video, BarChart, FileText,
         Settings, Users, LogOut, Loader2, Heart, Tag, ShieldCheck,
         Menu, X, ChevronLeft } from 'lucide-react'
import NotificationBell from '@/components/ui/NotificationBell'

const NAV = {
  student: [
    { label:'لوحتي',    href:'/dashboard/student',              Icon:LayoutDashboard },
    { label:'دوراتي',   href:'/dashboard/student/courses',      Icon:BookOpen },
    { label:'شهاداتي',  href:'/dashboard/student/certificates', Icon:Award },
    { label:'المفضلة',  href:'/dashboard/student/wishlist',     Icon:Heart },
  ],
  teacher: [
    { label:'لوحة التحكم',   href:'/dashboard/teacher',         Icon:LayoutDashboard },
    { label:'دوراتي',        href:'/dashboard/teacher/courses', Icon:Video },
    { label:'المبيعات',      href:'/dashboard/teacher/sales',   Icon:BarChart },
    { label:'الاختبارات',    href:'/dashboard/teacher/quizzes', Icon:FileText },
  ],
  admin: [
    { label:'نظرة عامة',   href:'/dashboard/admin',         Icon:LayoutDashboard },
    { label:'المستخدمون',  href:'/dashboard/admin/users',   Icon:Users },
    { label:'الدورات',     href:'/dashboard/admin/courses', Icon:ShieldCheck },
    { label:'الإيرادات',   href:'/dashboard/admin/revenue', Icon:BarChart },
    { label:'الكوبونات',   href:'/dashboard/admin/coupons', Icon:Tag },
  ],
}

type Device = 'mobile' | 'tablet' | 'desktop'

function useDevice(): { device: Device; isLandscape: boolean; width: number } {
  const [state, setState] = useState<{ device: Device; isLandscape: boolean; width: number }>({
    device: 'desktop', isLandscape: false, width: 1280
  })

  const update = useCallback(() => {
    const w = window.innerWidth
    const landscape = window.innerHeight < window.innerWidth
    const device: Device = w < 640 ? 'mobile' : w < 1200 ? 'tablet' : 'desktop'
    setState({ device, isLandscape: landscape, width: w })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', () => setTimeout(update, 150))
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', () => setTimeout(update, 150))
    }
  }, [update])

  return state
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role,       setRole]       = useState<'student'|'teacher'|'admin'|null>(null)
  const [profile,    setProfile]    = useState<any>(null)
  const [loading,    setLoading]    = useState(true)
  const [sidebarOpen,setSidebarOpen]= useState(false)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { device, isLandscape } = useDevice()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/auth/login'; return }
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => { setProfile(data); setRole((data?.role as any) ?? 'student'); setLoading(false) })
    })
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (loading) return (
    <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Loader2 size={32} className="spin" style={{color:'var(--alpha-green)'}}/>
    </div>
  )

  const items    = role ? NAV[role] : []
  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href + '/') && href.split('/').length > 3)

  const isMobile  = device === 'mobile'
  const isTablet  = device === 'tablet'
  const isDesktop = device === 'desktop'

  // ── Sidebar content (مشترك بين كل الأجهزة) ──────────────────────
  const SidebarContent = () => (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* Profile */}
      <div style={{padding:'14px 14px 12px',borderBottom:'1px solid var(--brd)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:38,height:38,borderRadius:'50%',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:900,color:'#fff',overflow:'hidden',flexShrink:0}}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : (profile?.full_name?.[0]||'ط')}
          </div>
          <div style={{minWidth:0,flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--tx1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {profile?.full_name||'مستخدم'}
            </div>
            <div style={{fontSize:10,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em'}}>
              {role==='admin'?'مدير':role==='teacher'?'معلم':'طالب'}
            </div>
          </div>
          <NotificationBell/>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:2,overflowY:'auto'}}>
        <p style={{fontSize:10,fontWeight:800,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--tx4)',padding:'4px 8px 8px'}}>
          القائمة
        </p>
        {items.map(({label,href,Icon})=>(
          <Link key={href} href={href}
            className={`nav-link${isActive(href)?' active':''}`}
            style={{textDecoration:'none',borderRadius:10,padding:'9px 12px',display:'flex',alignItems:'center',gap:9,fontSize:13.5,fontWeight:isActive(href)?700:500,color:isActive(href)?'var(--alpha-green)':'var(--tx2)',background:isActive(href)?'var(--alpha-green-l)':'transparent',transition:'all .15s'}}
            onClick={()=>setSidebarOpen(false)}>
            <Icon size={16} style={{color:isActive(href)?'var(--alpha-green)':'var(--tx3)',flexShrink:0}}/>{label}
          </Link>
        ))}
        <div style={{height:1,background:'var(--brd)',margin:'6px 4px'}}/>
        <Link href="/profile"
          className={`nav-link${pathname==='/profile'?' active':''}`}
          style={{textDecoration:'none',borderRadius:10,padding:'9px 12px',display:'flex',alignItems:'center',gap:9,fontSize:13.5,fontWeight:500,color:'var(--tx2)'}}
          onClick={()=>setSidebarOpen(false)}>
          <Settings size={16} style={{color:'var(--tx3)',flexShrink:0}}/>الحساب
        </Link>
        <button
          style={{borderRadius:10,padding:'9px 12px',display:'flex',alignItems:'center',gap:9,fontSize:13.5,fontWeight:500,color:'var(--err)',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',width:'100%',textAlign:'right'}}
          onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}>
          <LogOut size={16} style={{flexShrink:0}}/>خروج
        </button>
      </nav>
    </div>
  )

  // ═══ MOBILE — شريط سفلي ثابت ════════════════════════════════════
  if (isMobile) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:70}}>
      {/* Top bar */}
      <div style={{position:'sticky',top:60,zIndex:40,background:'var(--surface)',borderBottom:'1px solid var(--brd)',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <button onClick={()=>setSidebarOpen(o=>!o)}
          style={{display:'flex',alignItems:'center',gap:7,background:'none',border:'1.5px solid var(--brd)',borderRadius:9,padding:'7px 12px',cursor:'pointer',fontSize:13,fontWeight:600,color:'var(--tx1)',fontFamily:'inherit'}}>
          <Menu size={16}/>القائمة
        </button>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--tx3)'}}>
            {role==='admin'?'مدير':role==='teacher'?'معلم':'طالب'}
          </div>
          <div style={{width:32,height:32,borderRadius:'50%',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',overflow:'hidden'}}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : (profile?.full_name?.[0]||'ط')}
          </div>
          <NotificationBell/>
        </div>
      </div>

      {/* Drawer overlay */}
      {sidebarOpen && (
        <div style={{position:'fixed',inset:0,zIndex:90}} onClick={()=>setSidebarOpen(false)}>
          <div style={{position:'absolute',top:0,right:0,bottom:0,width:'78vw',maxWidth:300,background:'var(--surface)',boxShadow:'var(--sh3)',overflow:'hidden'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{padding:'12px 16px',borderBottom:'1px solid var(--brd)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:14,fontWeight:800,color:'var(--tx1)'}}>لوحة التحكم</span>
              <button onClick={()=>setSidebarOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--tx2)',display:'flex'}}>
                <X size={20}/>
              </button>
            </div>
            <SidebarContent/>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{padding:'16px 14px'}}>
        {children}
      </div>

      {/* Bottom nav */}
      <div style={{position:'fixed',bottom:0,right:0,left:0,zIndex:50,background:'var(--surface)',borderTop:'1px solid var(--brd)',display:'flex',alignItems:'stretch',boxShadow:'0 -4px 20px rgba(0,0,0,.07)'}}>
        {items.slice(0,4).map(({label,href,Icon})=>{
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'8px 4px',textDecoration:'none',color:active?'var(--alpha-green)':'var(--tx3)',background:active?'var(--alpha-green-l)':'transparent',borderTop:active?'2px solid var(--alpha-green)':'2px solid transparent',transition:'all .15s'}}>
              <Icon size={19}/>
              <span style={{fontSize:10,fontWeight:active?700:500,whiteSpace:'nowrap'}}>{label}</span>
            </Link>
          )
        })}
        <button
          style={{flex:0,width:52,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'8px 4px',background:'none',border:'none',cursor:'pointer',color:'var(--tx3)',borderTop:'2px solid transparent'}}
          onClick={()=>setSidebarOpen(o=>!o)}>
          <Menu size={19}/>
          <span style={{fontSize:10,fontWeight:500}}>المزيد</span>
        </button>
      </div>
    </div>
  )

  // ═══ TABLET — sidebar قابل للطي ══════════════════════════════════
  if (isTablet) return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',gap:0,alignItems:'flex-start',position:'relative'}}>

          {/* Sidebar toggle btn */}
          <button onClick={()=>setSidebarOpen(o=>!o)}
            style={{position:'fixed',top:72,right:sidebarOpen?236:16,zIndex:45,background:'var(--surface)',border:'1.5px solid var(--brd)',borderRadius:9,padding:'7px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,color:'var(--tx2)',boxShadow:'var(--sh1)',transition:'right .3s',fontFamily:'inherit'}}>
            {sidebarOpen ? <><X size={14}/>إخفاء</> : <><Menu size={14}/>القائمة</>}
          </button>

          {/* Sidebar panel */}
          <div style={{
            width: sidebarOpen ? 230 : 0,
            minWidth: sidebarOpen ? 230 : 0,
            overflow:'hidden',
            transition:'all .3s cubic-bezier(.4,0,.2,1)',
            flexShrink:0,
            position:'sticky',
            top:80,
            maxHeight:'calc(100vh - 100px)',
          }}>
            {sidebarOpen && (
              <div className="card" style={{width:220,padding:0,overflow:'hidden'}}>
                <SidebarContent/>
              </div>
            )}
          </div>

          {/* Main content */}
          <main style={{flex:1,minWidth:0,paddingRight:sidebarOpen?20:0,transition:'padding .3s'}}>
            {/* Breadcrumb mini on tablet */}
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:16,fontSize:12,color:'var(--tx4)'}}>
              <span style={{color:'var(--alpha-green)',fontWeight:700}}>
                {role==='admin'?'مدير':role==='teacher'?'معلم':'طالب'}
              </span>
              <ChevronLeft size={12}/>
              <span>{items.find(i=>isActive(i.href))?.label||'لوحة التحكم'}</span>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )

  // ═══ DESKTOP — layout كلاسيكي ════════════════════════════════════
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>
        <div style={{display:'flex',gap:24,alignItems:'flex-start'}}>

          {/* Sidebar ثابت */}
          <aside style={{width:234,flexShrink:0,position:'sticky',top:80,maxHeight:'calc(100vh - 100px)'}}>
            <div className="card" style={{padding:0,overflow:'hidden'}}>
              <SidebarContent/>
            </div>
          </aside>

          {/* Main */}
          <main style={{flex:1,minWidth:0}} className="fade-up">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
