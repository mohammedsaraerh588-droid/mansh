'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Home, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Stethoscope } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [profile,  setProfile]  = useState<any>(null)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const dark    = theme === 'dark'
  const isHero  = pathname === '/'
  const solid   = scrolled || !isHero

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
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const dashLink = !profile ? '/dashboard/student'
    : profile.role==='admin'   ? '/dashboard/admin'
    : profile.role==='teacher' ? '/dashboard/teacher'
    : '/dashboard/student'

  const links = [
    { label:'الرئيسية',     href:'/',        I:Home },
    { label:'الدورات الطبية', href:'/courses', I:BookOpen },
  ]

  // ألوان بناء على الخلفية
  const tc = (active: boolean) => solid
    ? (active ? 'var(--navy)'  : 'var(--txt2)')
    : (active ? '#fff'         : 'rgba(255,255,255,.7)')

  const navBg  = active => active && solid ? 'rgba(91,155,213,.09)' : 'transparent'

  return (
    <>
    <nav style={{
      position:'fixed', top:0, width:'100%', zIndex:100,
      background:  solid ? 'var(--nav-bg)'     : 'transparent',
      backdropFilter: solid ? 'blur(20px)'      : 'none',
      borderBottom:   solid ? '1px solid var(--nav-border)' : 'none',
      boxShadow:      solid ? 'var(--s1)'       : 'none',
      transition:'all .3s ease',
      padding: solid ? '9px 0' : '14px 0',
    }}>
      <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>

        {/* ── Logo ── */}
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
          <div style={{
            width:36, height:36, borderRadius:9,
            background: solid ? 'var(--navy)' : 'rgba(255,255,255,.15)',
            border: solid ? 'none' : '1.5px solid rgba(255,255,255,.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', boxShadow: solid ? 'var(--sn)' : 'none',
            transition:'all .25s',
          }}>
            <Stethoscope size={17}/>
          </div>
          <div style={{lineHeight:1.15}}>
            <div style={{fontSize:14,fontWeight:900,color:solid?'var(--txt1)':'#fff',transition:'color .3s'}}>منصة تعلّم</div>
            <div style={{fontSize:9,fontWeight:700,color:solid?'var(--txt3)':'rgba(255,255,255,.45)',letterSpacing:'.1em',textTransform:'uppercase'}}>Medical Education</div>
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div style={{display:'flex',alignItems:'center',gap:2,flex:1,justifyContent:'center'}} className="hidden md:flex">
          {links.map(({label,href,I})=>{
            const active = pathname===href
            return (
              <Link key={href} href={href} style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'7px 13px', borderRadius:8, textDecoration:'none',
                fontSize:13.5, fontWeight: active ? 700 : 600,
                color: tc(active), background: navBg(active),
                borderBottom: active && solid ? '2px solid var(--ceil)' : '2px solid transparent',
                transition:'all .18s',
              }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color=solid?'var(--navy)':'#fff';el.style.background=solid?'rgba(91,155,213,.09)':'rgba(255,255,255,.08)'}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color=tc(active);el.style.background=navBg(active)}}>
                <I size={14}/>{label}
              </Link>
            )
          })}
        </div>

        {/* ── Desktop Actions ── */}
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}} className="hidden md:flex">

          {/* Dark mode toggle */}
          <button onClick={toggle} style={{
            display:'flex',alignItems:'center',gap:5,
            padding:'6px 11px', borderRadius:8, cursor:'pointer',
            border:`1px solid ${solid?'var(--border2)':'rgba(255,255,255,.2)'}`,
            background: solid?'var(--surface)':'rgba(255,255,255,.08)',
            color: solid?'var(--txt2)':'rgba(255,255,255,.65)',
            fontSize:12.5, fontWeight:600, transition:'all .2s',
          }}
          onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='var(--ceil)';el.style.color=solid?'var(--ceil2)':'#fff'}}
          onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=solid?'var(--border2)':'rgba(255,255,255,.2)';el.style.color=solid?'var(--txt2)':'rgba(255,255,255,.65)'}}>
            {dark?<Sun size={13}/>:<Moon size={13}/>}
            {dark?'فاتح':'مظلم'}
          </button>

          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Link href={dashLink} style={{
                display:'flex',alignItems:'center',gap:5,
                padding:'7px 13px', borderRadius:8, textDecoration:'none',
                fontSize:13, fontWeight:700, color:tc(false), transition:'all .18s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(91,155,213,.09)';(e.currentTarget as HTMLElement).style.color=solid?'var(--navy)':'#fff'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color=tc(false)}}>
                <LayoutDashboard size={13}/>لوحة التحكم
              </Link>
              <Link href="/profile">
                <div style={{
                  width:34, height:34, borderRadius:'50%', overflow:'hidden', cursor:'pointer',
                  border:'2.5px solid var(--ceil)', boxShadow:'var(--sc)', transition:'transform .2s',
                }}
                onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.08)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{width:'100%',height:'100%',background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff'}}>
                        {profile?.full_name?.[0] ?? 'د'}
                      </div>}
                </div>
              </Link>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Link href="/auth/login" style={{
                padding:'7px 13px', borderRadius:8, textDecoration:'none',
                fontSize:13, fontWeight:700, color:tc(false), transition:'color .2s',
              }}
              onMouseEnter={e=>(e.currentTarget.style.color=solid?'var(--navy)':'#fff')}
              onMouseLeave={e=>(e.currentTarget.style.color=tc(false))}>
                تسجيل الدخول
              </Link>
              <Link href="/auth/register"
                className={`btn btn-md ${solid?'btn-primary':'btn-white'}`}
                style={{textDecoration:'none'}}>
                ابدأ مجاناً
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile ── */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="md:hidden">
          <button onClick={toggle} style={{
            width:32, height:32, borderRadius:8, cursor:'pointer',
            border:`1px solid ${solid?'var(--border2)':'rgba(255,255,255,.2)'}`,
            background:solid?'var(--surface)':'rgba(255,255,255,.08)',
            color:solid?'var(--txt2)':'rgba(255,255,255,.7)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {dark?<Sun size={14}/>:<Moon size={14}/>}
          </button>
          <button onClick={()=>setOpen(!open)} style={{
            background:'none', border:'none', cursor:'pointer',
            color:solid?'var(--txt1)':'#fff', padding:4, display:'flex',
          }}>
            {open?<X size={21}/>:<Menu size={21}/>}
          </button>
        </div>
      </div>
    </nav>

    {/* ── Mobile Drawer ── */}
    {open && (
      <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setOpen(false)}>
        <div style={{
          position:'absolute', top:56, left:0, right:0,
          background:'var(--nav-bg)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid var(--nav-border)',
          padding:'12px 16px 18px',
          display:'flex', flexDirection:'column', gap:4,
          boxShadow:'var(--s3)',
        }} onClick={e=>e.stopPropagation()}>
          {links.map(({label,href,I})=>(
            <Link key={href} href={href}
              className={`nav-link${pathname===href?' active':''}`}
              onClick={()=>setOpen(false)}>
              <I size={15}/>{label}
            </Link>
          ))}
          <div style={{height:1,background:'var(--border)',margin:'6px 4px'}}/>
          <button onClick={toggle} className="nav-link"
            style={{background:'none',border:'none',fontFamily:'inherit',cursor:'pointer',textAlign:'right'}}>
            {dark?<Sun size={14}/>:<Moon size={14}/>}
            {dark?'الوضع الفاتح':'الوضع المظلم'}
          </button>
          <div style={{height:1,background:'var(--border)',margin:'6px 4px'}}/>
          {user ? (<>
            <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}>
              <LayoutDashboard size={14}/>لوحة التحكم
            </Link>
            <button className="nav-link danger"
              style={{background:'none',border:'none',fontFamily:'inherit',cursor:'pointer',textAlign:'right'}}
              onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
              <LogOut size={14}/>تسجيل الخروج
            </button>
          </>) : (
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
              <Link href="/auth/login"  className="nav-link" onClick={()=>setOpen(false)}>تسجيل الدخول</Link>
              <Link href="/auth/register" className="btn btn-primary btn-md btn-full"
                style={{textDecoration:'none'}} onClick={()=>setOpen(false)}>ابدأ مجاناً</Link>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
