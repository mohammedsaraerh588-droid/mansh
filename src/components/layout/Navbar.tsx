'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Home, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [profile,  setProfile]  = useState<any>(null)
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
      if (s?.user) supabase.from('profiles').select('*').eq('id', s.user.id).single()
        .then(({ data }) => setProfile(data))
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
  const dashLink = !profile ? '/dashboard/student'
    : profile.role === 'admin'   ? '/dashboard/admin'
    : profile.role === 'teacher' ? '/dashboard/teacher'
    : '/dashboard/student'

  const links = [
    { label:'الرئيسية', href:'/', I:Home },
    { label:'الدورات',  href:'/courses', I:BookOpen },
  ]

  /* shared text color */
  const linkC = (active:boolean) => solid
    ? active ? 'var(--gold)' : 'var(--txt2)'
    : active ? '#fff'        : 'rgba(255,255,255,.62)'

  return (
    <>
    <nav style={{
      position:'fixed', top:0, width:'100%', zIndex:50,
      background: solid ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: solid ? 'blur(20px)' : 'none',
      borderBottom: solid ? '1px solid var(--nav-border)' : 'none',
      boxShadow: solid ? 'var(--s1)' : 'none',
      transition: 'all .35s',
      padding: solid ? '11px 0' : '19px 0',
    }}>
      <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>

        {/* Logo */}
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#a07828,#c49a3c)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:'#fff',transition:'transform .3s'}}
            onMouseEnter={e=>(e.currentTarget.style.transform='rotate(-6deg) scale(1.08)')}
            onMouseLeave={e=>(e.currentTarget.style.transform='none')}>م</div>
          <span style={{fontSize:16,fontWeight:900,color: solid?'var(--txt1)':'#fff',transition:'color .3s'}}>
            منصة <span className="g-text">تعلّم</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{display:'flex',alignItems:'center',gap:2}} className="hidden md:flex">
          {links.map(({label,href,I})=>(
            <Link key={href} href={href} style={{
              display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:9,
              textDecoration:'none',fontSize:14,fontWeight:600,transition:'all .18s',
              color:linkC(pathname===href),
              background: pathname===href && solid ? 'var(--gold-bg)' : 'transparent',
              borderBottom: pathname===href ? '2px solid var(--gold2)' : '2px solid transparent',
            }}>
              <I size={14}/>{label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="hidden md:flex">
          {/* theme toggle */}
          <button onClick={toggle} className="toggle" style={{justifyContent:dark?'flex-end':'flex-start'}} title={dark?'وضع فاتح':'وضع مظلم'}>
            <span className="toggle-knob">{dark?<Moon size={10} color="#fff"/>:<Sun size={10} color="#7a5a10"/>}</span>
          </button>

          {user ? (
            <>
              <Link href={dashLink} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:9,textDecoration:'none',fontSize:13.5,fontWeight:700,color:linkC(false),transition:'all .18s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='var(--gold)';(e.currentTarget as HTMLElement).style.background='var(--gold-bg)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=linkC(false);(e.currentTarget as HTMLElement).style.background='transparent'}}>
                <LayoutDashboard size={14}/>لوحة التحكم
              </Link>
              <Link href="/profile">
                <div style={{width:34,height:34,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--gold2)',cursor:'pointer',transition:'transform .2s',flexShrink:0}}
                  onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.08)')}
                  onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#a07828,#c49a3c)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff'}}>
                        {profile?.full_name?.[0]??'أ'}
                      </div>}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{padding:'7px 14px',borderRadius:9,textDecoration:'none',fontSize:13.5,fontWeight:700,color:linkC(false),transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color='var(--gold)')}
                onMouseLeave={e=>(e.currentTarget.style.color=linkC(false))}>
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" className="btn btn-gold btn-md" style={{textDecoration:'none'}}>ابدأ مجاناً</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="md:hidden">
          <button onClick={toggle} className="toggle" style={{justifyContent:dark?'flex-end':'flex-start'}}>
            <span className="toggle-knob">{dark?<Moon size={10} color="#fff"/>:<Sun size={10} color="#7a5a10"/>}</span>
          </button>
          <button onClick={()=>setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',color:solid?'var(--txt1)':'#fff',padding:4,display:'flex'}}>
            {open?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile drawer */}
    {open && (
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:49}} onClick={()=>setOpen(false)}>
        <div style={{position:'absolute',top:56,left:0,right:0,background:'var(--nav-bg)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--nav-border)',padding:'10px 16px 16px',display:'flex',flexDirection:'column',gap:3,boxShadow:'var(--s3)'}}
          onClick={e=>e.stopPropagation()}>
          {links.map(({label,href,I})=>(
            <Link key={href} href={href} className={`nav-link ${pathname===href?'active':''}`} onClick={()=>setOpen(false)}>
              <I size={15}/>{label}
            </Link>
          ))}
          <div style={{height:1,background:'var(--border)',margin:'6px 4px'}}/>
          {user ? (
            <>
              <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}><LayoutDashboard size={15}/>لوحة التحكم</Link>
              <Link href="/profile" className="nav-link" onClick={()=>setOpen(false)}><div style={{width:16,height:16,borderRadius:'50%',background:'linear-gradient(135deg,#a07828,#c49a3c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#fff',fontWeight:900}}>{profile?.full_name?.[0]??'أ'}</div>الملف الشخصي</Link>
              <button className="nav-link danger" onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
                <LogOut size={15}/>تسجيل الخروج
              </button>
            </>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
              <Link href="/auth/login" className="nav-link" onClick={()=>setOpen(false)}>تسجيل الدخول</Link>
              <Link href="/auth/register" className="btn btn-gold btn-md btn-full" style={{textDecoration:'none'}} onClick={()=>setOpen(false)}>ابدأ مجاناً</Link>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
