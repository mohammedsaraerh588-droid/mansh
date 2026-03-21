'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Stethoscope, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Search, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [profile,  setProfile]  = useState<any>(null)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const dark   = theme === 'dark'
  const isHero = pathname === '/'
  const solid  = scrolled || !isHero

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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const dashLink = profile?.role==='admin' ? '/dashboard/admin' : profile?.role==='teacher' ? '/dashboard/teacher' : '/dashboard/student'

  const navLinks = [
    { label:'الدورات', href:'/courses' },
    { label:'من نحن',  href:'/about'   },
    { label:'التواصل', href:'/contact' },
  ]

  return (
    <>
      <nav style={{
        position:'fixed', top:0, width:'100%', zIndex:100,
        background: solid ? 'rgba(15,15,19,.95)' : 'transparent',
        backdropFilter: solid ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: solid ? '1px solid rgba(255,255,255,.07)' : 'none',
        boxShadow: solid ? '0 1px 20px rgba(0,0,0,.4)' : 'none',
        transition: 'all .3s ease',
        padding: solid ? '10px 0' : '16px 0',
      }}>
        <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none',flexShrink:0}}>
            <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,var(--brand),var(--brand-h))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 2px 12px rgba(124,58,237,.4)'}}>
              <Stethoscope size={17} style={{color:'#fff'}}/>
            </div>
            <div style={{lineHeight:1.2}}>
              <div style={{fontSize:14,fontWeight:900,color:'#fff',letterSpacing:'-.01em'}}>منصة تعلّم</div>
              <div style={{fontSize:9.5,fontWeight:600,color:'rgba(255,255,255,.35)',letterSpacing:'.08em',textTransform:'uppercase'}}>Medical Education</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{display:'flex',alignItems:'center',gap:2}} className="hidden md:flex">
            {navLinks.map(({label,href})=>{
              const active = pathname===href || (href!=='/' && pathname.startsWith(href))
              return (
                <Link key={href} href={href} style={{
                  padding:'7px 13px', borderRadius:8, fontSize:13.5, fontWeight: active?700:500,
                  color: active?'#fff':'rgba(255,255,255,.55)',
                  background: active?'rgba(124,58,237,.2)':'transparent',
                  textDecoration:'none', transition:'all .15s',
                  border: active?'1px solid rgba(124,58,237,.3)':'1px solid transparent'
                }}>
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}} className="hidden md:flex">
            <Link href="/search" style={{width:34,height:34,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.6)',cursor:'pointer',textDecoration:'none',transition:'all .15s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(124,58,237,.4)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.1)'}}>
              <Search size={15}/>
            </Link>

            {user ? (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Link href={dashLink} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:8,fontSize:13.5,fontWeight:600,color:'rgba(255,255,255,.7)',textDecoration:'none',border:'1px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.05)',transition:'all .15s'}}>
                  <LayoutDashboard size={14}/>لوحتي
                </Link>
                <Link href="/profile">
                  <div style={{width:32,height:32,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--brand)',cursor:'pointer',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',boxShadow:'0 2px 10px rgba(124,58,237,.4)'}}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      : (profile?.full_name?.[0]||'ط')}
                  </div>
                </Link>
              </div>
            ) : (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Link href="/auth/login" style={{padding:'7px 14px',borderRadius:8,fontSize:13.5,fontWeight:600,color:'rgba(255,255,255,.7)',textDecoration:'none',transition:'color .2s'}}>
                  دخول
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-md" style={{textDecoration:'none'}}>
                  <Sparkles size={13}/>سجّل مجاناً
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div style={{display:'flex',alignItems:'center',gap:8}} className="md:hidden">
            <button onClick={()=>setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.8)',display:'flex',padding:4}}>
              {open?<X size={21}/>:<Menu size={21}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setOpen(false)}>
          <div style={{position:'absolute',top:56,left:0,right:0,background:'rgba(15,15,19,.98)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,.07)',padding:'12px 20px 18px',display:'flex',flexDirection:'column',gap:4,boxShadow:'0 20px 40px rgba(0,0,0,.6)'}} onClick={e=>e.stopPropagation()}>
            {navLinks.map(({label,href})=>(
              <Link key={href} href={href} className={`nav-link${pathname===href?' active':''}`} onClick={()=>setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/search" className="nav-link" onClick={()=>setOpen(false)}><Search size={14}/>بحث</Link>
            <div style={{height:1,background:'var(--brd)',margin:'6px 0'}}/>
            {user ? (<>
              <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}><LayoutDashboard size={14}/>لوحتي</Link>
              <button className="nav-link danger" style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}
                onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
                <LogOut size={14}/>خروج
              </button>
            </>) : (<>
              <Link href="/auth/login" className="nav-link" onClick={()=>setOpen(false)}>تسجيل دخول</Link>
              <Link href="/auth/register" className="btn btn-primary btn-md btn-full" style={{textDecoration:'none',marginTop:6}} onClick={()=>setOpen(false)}>سجّل مجاناً</Link>
            </>)}
          </div>
        </div>
      )}
    </>
  )
}
