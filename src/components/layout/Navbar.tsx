'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Stethoscope, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const [open,    setOpen]    = useState(false)
  const [user,    setUser]    = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  // أغلق الدرور عند تغيير الصفحة
  useEffect(() => { setOpen(false) }, [pathname])

  const dashLink  = profile?.role==='admin' ? '/dashboard/admin' : profile?.role==='teacher' ? '/dashboard/teacher' : '/dashboard/student'

  const navItems = [
    { label:'الرئيسية', href:'/' },
    { label:'الدورات',  href:'/courses' },
    { label:'المعلمون', href:'/instructors' },
    { label:'الأسئلة',  href:'/faq' },
  ]

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <div className="main-header">
        <div className="nav-bar">

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none',flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:9,background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px rgba(76,175,80,.35)'}}>
              <Stethoscope size={18} style={{color:'#fff'}}/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:'var(--tx1)',lineHeight:1.1}}>منصة تعلّم</div>
              <div style={{fontSize:9,fontWeight:600,color:'var(--tx4)',letterSpacing:'.1em',textTransform:'uppercase'}}>Medical Edu</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <ul className="nav-links" style={{display:'flex',margin:'0 auto'}}>
              {navItems.map(({label,href})=>(
                <li key={href}>
                  <Link href={href} className={`alpha-btn-nav${isActive(href)?' active':''}`}>{label}</Link>
                </li>
              ))}
            </ul>
          )}

          {/* Action buttons */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {!isMobile && (
              <>
                {user ? (
                  <>
                    <Link href={dashLink} className="alpha-btn alpha-btn-primary" style={{textDecoration:'none',fontSize:13,padding:'8px 16px'}}>
                      <LayoutDashboard size={14}/>لوحتي
                    </Link>
                    <Link href="/profile">
                      <div style={{width:34,height:34,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--alpha-green)',cursor:'pointer',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',position:'relative'}}>
                        {profile?.avatar_url
                          ? <Image src={profile.avatar_url} alt="" fill style={{objectFit:'cover'}}/>
                          : (profile?.full_name?.[0]||'ط')}
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login"    className="btn-login"    style={{fontSize:13,padding:'8px 16px'}}>دخول</Link>
                    <Link href="/auth/register" className="btn-register" style={{fontSize:13,padding:'8px 18px'}}>إنشاء حساب</Link>
                  </>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <button onClick={()=>setOpen(o=>!o)}
                style={{background:'none',border:'1.5px solid var(--brd)',borderRadius:9,cursor:'pointer',color:'var(--tx1)',padding:'6px 8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {open ? <X size={20}/> : <Menu size={20}/>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Mobile Drawer ═══ */}
      {isMobile && open && (
        <div style={{position:'fixed',inset:0,zIndex:98}} onClick={()=>setOpen(false)}>
          <div
            style={{position:'absolute',top:56,right:0,left:0,background:'rgba(255,255,255,.98)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--brd)',padding:'16px',boxShadow:'0 8px 32px rgba(0,0,0,.12)',display:'flex',flexDirection:'column',gap:6}}
            onClick={e=>e.stopPropagation()}>

            {/* Nav links */}
            {navItems.map(({label,href})=>(
              <Link key={href} href={href}
                style={{display:'flex',alignItems:'center',padding:'11px 14px',borderRadius:10,fontSize:15,fontWeight:isActive(href)?700:500,color:isActive(href)?'var(--alpha-green)':'var(--tx1)',background:isActive(href)?'var(--alpha-green-l)':'transparent',textDecoration:'none'}}>
                {label}
              </Link>
            ))}

            <div style={{height:1,background:'var(--brd)',margin:'4px 0'}}/>

            {/* Auth section */}
            {user ? (
              <>
                <Link href={dashLink}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',borderRadius:10,fontSize:15,fontWeight:600,color:'var(--tx1)',textDecoration:'none'}}>
                  <LayoutDashboard size={16} style={{color:'var(--alpha-green)'}}/>لوحة التحكم
                </Link>
                <Link href="/profile"
                  style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',borderRadius:10,fontSize:15,fontWeight:600,color:'var(--tx1)',textDecoration:'none'}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:'#fff',flexShrink:0}}>
                    {profile?.full_name?.[0]||'ط'}
                  </div>
                  {profile?.full_name||'الملف الشخصي'}
                </Link>
                <button
                  onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',borderRadius:10,fontSize:15,fontWeight:600,color:'var(--err)',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',width:'100%',textAlign:'right'}}>
                  <LogOut size={16}/>تسجيل خروج
                </button>
              </>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
                <Link href="/auth/login" className="btn-login" style={{justifyContent:'center',padding:'11px 0'}}>دخول</Link>
                <Link href="/auth/register" className="btn-register" style={{justifyContent:'center',padding:'11px 0'}}>إنشاء حساب مجاني</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
