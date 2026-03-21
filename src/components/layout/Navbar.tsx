'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Stethoscope, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const [open,    setOpen]    = useState(false)
  const [user,    setUser]    = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user ?? null)
      if (s?.user) supabase.from('profiles').select('*').eq('id', s.user.id).single().then(({ data }) => setProfile(data))
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const dashLink = profile?.role==='admin' ? '/dashboard/admin' : profile?.role==='teacher' ? '/dashboard/teacher' : '/dashboard/student'

  const navItems = [
    { label:'الرئيسية', href:'/' },
    { label:'الدورات',  href:'/courses' },
    { label:'المعلمون', href:'/about' },
    { label:'الأخبار',  href:'/faq' },
  ]

  return (
    <>
      <div className="main-header">
        <div className="nav-bar">
          {/* Logo */}
          <nav style={{display:'flex',alignItems:'center',gap:24}}>
            <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none'}}>
              <div style={{width:36,height:36,borderRadius:9,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px rgba(76,175,80,.35)'}}>
                <Stethoscope size={18} style={{color:'#fff'}}/>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:900,color:'var(--tx1)',lineHeight:1.1}}>منصة تعلّم</div>
                <div style={{fontSize:9,fontWeight:600,color:'var(--tx4)',letterSpacing:'.1em',textTransform:'uppercase'}}>Medical Edu</div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <ul className="nav-links" style={{display:'flex'}} suppressHydrationWarning>
              {navItems.map(({label,href})=>(
                <li key={href}>
                  <Link href={href} className={`alpha-btn-nav${pathname===href||pathname.startsWith(href+'/')&&href!=='/'?' active':''}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action buttons */}
          <div className="action-buttons">
            <button onClick={toggle} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center'}}>
              <input
                type="checkbox"
                className="theme-checkbox"
                checked={dark}
                onChange={toggle}
                title={dark?'الوضع الفاتح':'الوضع المظلم'}
              />
            </button>

            {user ? (
              <>
                <Link href={dashLink} className="alpha-btn alpha-btn-primary" style={{textDecoration:'none',fontSize:13,padding:'8px 16px'}}>
                  <LayoutDashboard size={14}/>لوحتي
                </Link>
                <Link href="/profile">
                  <div style={{width:34,height:34,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--alpha-green)',cursor:'pointer',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff'}}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      : (profile?.full_name?.[0]||'ط')}
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-login" style={{fontSize:13,padding:'8px 16px'}}>دخول</Link>
                <Link href="/auth/register" className="btn-register" style={{fontSize:13,padding:'8px 18px'}}>إنشاء حساب</Link>
              </>
            )}

            {/* Mobile toggle */}
            <button onClick={()=>setOpen(!open)} className="md:hidden" style={{background:'none',border:'none',cursor:'pointer',color:'var(--tx1)',display:'none',padding:4}}>
              {open ? <X size={21}/> : <Menu size={21}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setOpen(false)}>
          <div style={{position:'absolute',top:60,left:0,right:0,background:'rgba(255,255,255,.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--brd)',padding:'12px 20px 18px',display:'flex',flexDirection:'column',gap:4,boxShadow:'var(--sh3)'}} onClick={e=>e.stopPropagation()}>
            {navItems.map(({label,href})=>(
              <Link key={href} href={href} className={`nav-link${pathname===href?' active':''}`} onClick={()=>setOpen(false)}>{label}</Link>
            ))}
            <div style={{height:1,background:'var(--brd)',margin:'6px 0'}}/>
            {user ? (<>
              <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}><LayoutDashboard size={14}/>لوحتي</Link>
              <button className="nav-link danger" style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}
                onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
                <LogOut size={14}/>خروج
              </button>
            </>) : (<>
              <Link href="/auth/login" className="btn-login btn-full" style={{marginTop:4}} onClick={()=>setOpen(false)}>دخول</Link>
              <Link href="/auth/register" className="btn-register btn-full" style={{marginTop:6,justifyContent:'center'}} onClick={()=>setOpen(false)}>إنشاء حساب</Link>
            </>)}
          </div>
        </div>
      )}
    </>
  )
}
