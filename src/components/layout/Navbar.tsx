'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Home, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [open,      setOpen]      = useState(false)
  const [user,      setUser]      = useState<any>(null)
  const [profile,   setProfile]   = useState<any>(null)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      setUser(session.user)
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => setProfile(data))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user ?? null)
      if (s?.user) supabase.from('profiles').select('*').eq('id', s.user.id).single().then(({ data }) => setProfile(data))
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isHero   = pathname === '/'
  const solid    = scrolled || !isHero
  const dashLink = !profile ? '/dashboard/student' : profile.role === 'admin' ? '/dashboard/admin' : profile.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'
  const links    = [{ label:'الرئيسية', href:'/', Icon:Home }, { label:'الدورات', href:'/courses', Icon:BookOpen }]

  const txt  = solid ? 'var(--txt2)' : 'rgba(255,255,255,.65)'
  const txtH = solid ? 'var(--txt1)' : '#fff'

  return (
    <nav style={{
      position:'fixed', top:0, width:'100%', zIndex:50,
      background: solid ? 'var(--nav-bg)' : 'transparent',
      borderBottom: solid ? '1px solid var(--nav-border)' : 'none',
      backdropFilter: solid ? 'blur(20px)' : 'none',
      boxShadow: solid ? 'var(--shadow1)' : 'none',
      transition: 'all .35s',
      padding: solid ? '12px 0' : '20px 0',
    }}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>

        {/* Logo */}
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:18,background:'linear-gradient(135deg,#b8912a,#d4a843)',color:'#fff',flexShrink:0}}>م</div>
          <span style={{fontSize:17,fontWeight:900,color: solid ? 'var(--txt1)' : '#fff',transition:'color .3s'}}>
            منصة <span style={{background:'linear-gradient(135deg,#b8912a,#f0c96a)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>تعلّم</span>
          </span>
        </Link>

        {/* Desktop */}
        <div style={{display:'flex',alignItems:'center',gap:4}} className="hidden md:flex">
          {links.map(({ label, href, Icon }) => (
            <Link key={href} href={href} style={{
              display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:9,
              textDecoration:'none',fontSize:14,fontWeight:600,transition:'all .2s',
              color: pathname===href ? 'var(--gold)' : txt,
              background: pathname===href && solid ? 'var(--gold-bg)' : 'transparent',
              borderBottom: pathname===href ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              <Icon size={15}/>{label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:10}} className="hidden md:flex">
          {/* Theme toggle */}
          <button onClick={toggle} className="toggle-wrap" style={{justifyContent:dark?'flex-end':'flex-start'}} title={dark?'وضع فاتح':'وضع مظلم'}>
            <span className="toggle-knob">{dark ? <Moon size={11} color="#fff"/> : <Sun size={11} color="#92400e"/>}</span>
          </button>
          {user ? (
            <>
              <Link href={dashLink} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:9,textDecoration:'none',fontSize:13.5,fontWeight:700,color:txt,transition:'all .2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--gold)';(e.currentTarget as HTMLElement).style.background='var(--gold-bg)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=txt;(e.currentTarget as HTMLElement).style.background='transparent'}}>
                <LayoutDashboard size={15}/>لوحة التحكم
              </Link>
              <Link href="/profile">
                <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--gold)',cursor:'pointer',flexShrink:0}}>
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> :
                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,background:'linear-gradient(135deg,#b8912a,#d4a843)',color:'#fff'}}>
                      {profile?.full_name?.[0] ?? 'أ'}
                    </div>}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{padding:'8px 16px',borderRadius:9,textDecoration:'none',fontSize:14,fontWeight:700,color:txt,transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--gold)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=txt}>
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" className="btn btn-gold btn-md" style={{textDecoration:'none'}}>ابدأ مجاناً</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="md:hidden">
          <button onClick={toggle} className="toggle-wrap" style={{justifyContent:dark?'flex-end':'flex-start'}}>
            <span className="toggle-knob">{dark ? <Moon size={10} color="#fff"/> : <Sun size={10} color="#92400e"/>}</span>
          </button>
          <button onClick={()=>setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',color: solid?'var(--txt1)':'#fff',padding:4}}>
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{background:'var(--nav-bg)',borderTop:'1px solid var(--nav-border)',padding:'12px 16px',display:'flex',flexDirection:'column',gap:4}} className="md:hidden">
          {links.map(({ label, href, Icon }) => (
            <Link key={href} href={href} className={`nav-link ${pathname===href?'active':''}`} onClick={()=>setOpen(false)}>
              <Icon size={16}/>{label}
            </Link>
          ))}
          <div style={{height:1,background:'var(--border)',margin:'6px 0'}}/>
          {user ? (
            <>
              <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}><LayoutDashboard size={16}/>لوحة التحكم</Link>
              <button className="nav-link danger" style={{background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'right',fontFamily:'inherit'}}
                onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}>
                <LogOut size={16}/>تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="nav-link" onClick={()=>setOpen(false)}>تسجيل الدخول</Link>
              <Link href="/auth/register" className="btn btn-gold btn-md" style={{textDecoration:'none',justifyContent:'center'}} onClick={()=>setOpen(false)}>ابدأ مجاناً</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
