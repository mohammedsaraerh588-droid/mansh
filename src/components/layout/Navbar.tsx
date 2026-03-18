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
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()
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

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isHero   = pathname === '/'
  const solid    = scrolled || !isHero
  const dashLink = !profile ? '/dashboard/student' : profile.role==='admin' ? '/dashboard/admin' : profile.role==='teacher' ? '/dashboard/teacher' : '/dashboard/student'
  const links    = [{ label:'الرئيسية', href:'/', I:Home }, { label:'الدورات الطبية', href:'/courses', I:BookOpen }]
  const lc       = (a:boolean) => solid ? (a?'var(--teal)':'var(--txt2)') : (a?'#fff':'rgba(255,255,255,.65)')

  return (
    <>
    <nav style={{position:'fixed',top:0,width:'100%',zIndex:100,background:solid?'var(--nav-bg)':'transparent',backdropFilter:solid?'blur(18px) saturate(180%)':'none',borderBottom:solid?'1px solid var(--nav-border)':'none',boxShadow:solid?'var(--s1)':'none',transition:'all .32s ease',padding:solid?'10px 0':'17px 0'}}>
      <div className="wrap" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        {/* Logo */}
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:36,height:36,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',boxShadow:'var(--st)',transition:'transform .22s'}}
            onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.08)')}
            onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
            <Stethoscope size={18}/>
          </div>
          <div style={{lineHeight:1.1}}>
            <span style={{fontSize:15,fontWeight:900,color:solid?'var(--txt1)':'#fff',transition:'color .3s',display:'block'}}>منصة تعلّم</span>
            <span style={{fontSize:10,fontWeight:600,color:'var(--teal)',letterSpacing:'.06em',textTransform:'uppercase'}}>Medical Education</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{display:'flex',alignItems:'center',gap:2}} className="hidden md:flex">
          {links.map(({label,href,I})=>(
            <Link key={href} href={href} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:9,textDecoration:'none',fontSize:14,fontWeight:600,transition:'all .16s',color:lc(pathname===href),background:pathname===href&&solid?'var(--teal-soft)':'transparent'}}>
              <I size={14}/>{label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="hidden md:flex">
          <button onClick={toggle}
            title={dark ? 'الوضع الفاتح' : 'الوضع المظلم'}
            style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'7px 12px', borderRadius:9, cursor:'pointer',
              border:`1px solid ${solid ? 'var(--border2)' : 'rgba(255,255,255,.2)'}`,
              background: solid ? 'var(--surface)' : 'rgba(255,255,255,.08)',
              color: solid ? 'var(--txt2)' : 'rgba(255,255,255,.75)',
              fontSize:13, fontWeight:600, transition:'all .2s',
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=solid?'var(--border2)':'rgba(255,255,255,.2)';(e.currentTarget as HTMLElement).style.color=solid?'var(--txt2)':'rgba(255,255,255,.75)'}}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
            {dark ? 'فاتح' : 'مظلم'}
          </button>
          {user ? (
            <>
              <Link href={dashLink} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:9,textDecoration:'none',fontSize:13.5,fontWeight:700,color:lc(false),transition:'all .16s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--teal-soft)';(e.currentTarget as HTMLElement).style.color='var(--teal)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color=lc(false)}}>
                <LayoutDashboard size={14}/>لوحة التحكم
              </Link>
              <Link href="/profile">
                <div style={{width:34,height:34,borderRadius:'50%',overflow:'hidden',border:'2px solid var(--teal)',cursor:'pointer',transition:'transform .2s'}}
                  onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.08)')}
                  onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> :
                    <div style={{width:'100%',height:'100%',background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff'}}>{profile?.full_name?.[0]??'د'}</div>}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{padding:'7px 14px',borderRadius:9,textDecoration:'none',fontSize:13.5,fontWeight:700,color:lc(false),transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color='var(--teal)')}
                onMouseLeave={e=>(e.currentTarget.style.color=lc(false))}>تسجيل الدخول</Link>
              <Link href="/auth/register" className="btn btn-primary btn-md" style={{textDecoration:'none'}}>ابدأ مجاناً</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div style={{display:'flex',alignItems:'center',gap:8}} className="md:hidden">
          <button onClick={()=>setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',color:solid?'var(--txt1)':'#fff',padding:4,display:'flex'}}>
            {open?<X size={22}/>:<Menu size={22}/>}
          </button>
        </div>
      </div>
    </nav>

    {open && (
      <div style={{position:'fixed',inset:0,zIndex:99}} onClick={()=>setOpen(false)}>
        <div style={{position:'absolute',top:54,left:0,right:0,background:'var(--nav-bg)',backdropFilter:'blur(18px)',borderBottom:'1px solid var(--nav-border)',padding:'10px 14px 16px',display:'flex',flexDirection:'column',gap:3,boxShadow:'var(--s3)'}}
          onClick={e=>e.stopPropagation()}>
          {links.map(({label,href,I})=>(
            <Link key={href} href={href} className={`nav-link${pathname===href?' active':''}`} onClick={()=>setOpen(false)}>
              <I size={15}/>{label}
            </Link>
          ))}
          <div style={{height:1,background:'var(--border)',margin:'6px 4px'}}/>
          <button onClick={toggle} className="nav-link" style={{background:'none',border:'none',width:'100%',textAlign:'right',fontFamily:'inherit'}}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
            {dark ? 'الوضع الفاتح' : 'الوضع المظلم'}
          </button>
          <div style={{height:1,background:'var(--border)',margin:'6px 4px'}}/>
          {user ? (
            <>
              <Link href={dashLink} className="nav-link" onClick={()=>setOpen(false)}><LayoutDashboard size={15}/>لوحة التحكم</Link>
              <button className="nav-link danger" onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
                <LogOut size={15}/>تسجيل الخروج
              </button>
            </>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
              <Link href="/auth/login" className="nav-link" onClick={()=>setOpen(false)}>تسجيل الدخول</Link>
              <Link href="/auth/register" className="btn btn-primary btn-md btn-full" style={{textDecoration:'none'}} onClick={()=>setOpen(false)}>ابدأ مجاناً</Link>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
