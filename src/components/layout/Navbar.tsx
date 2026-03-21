'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { Stethoscope, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Search } from 'lucide-react'

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

  const dashLink = profile?.role === 'admin' ? '/dashboard/admin' : profile?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'

  const navLinks = [
    { label: 'الدورات',  href: '/courses'  },
    { label: 'من نحن',   href: '/about'    },
    { label: 'تواصل',    href: '/contact'  },
  ]

  const solidBg   = 'var(--nav-bg)'
  const transBg   = 'transparent'
  const solidTxt  = 'var(--tx2)'
  const transTxt  = 'rgba(255,255,255,.8)'
  const activeTxt = solid ? 'var(--brand)' : '#fff'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background:   solid ? solidBg   : transBg,
        backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: solid ? '1px solid var(--nav-border)' : 'none',
        boxShadow:    solid ? 'var(--sh1)' : 'none',
        transition:   'all .3s ease',
        padding:      solid ? '10px 0' : '16px 0',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Stethoscope size={17} style={{ color: '#fff' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: solid ? 'var(--tx1)' : '#fff', letterSpacing: '-.01em' }}>منصة تعلّم</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: solid ? 'var(--tx4)' : 'rgba(255,255,255,.45)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Medical Education</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link key={href} href={href} style={{
                  padding: '7px 13px', borderRadius: 7, fontSize: 13.5, fontWeight: active ? 700 : 500,
                  color: active ? activeTxt : solid ? solidTxt : transTxt,
                  background: active && solid ? 'var(--brand-l)' : 'transparent',
                  textDecoration: 'none', transition: 'all .15s', display: 'flex', alignItems: 'center'
                }}>
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="hidden md:flex">
            <Link href="/search" style={{
              width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${solid ? 'var(--brd)' : 'rgba(255,255,255,.2)'}`,
              background: solid ? 'var(--surface2)' : 'rgba(255,255,255,.08)',
              color: solid ? 'var(--tx3)' : 'rgba(255,255,255,.7)', cursor: 'pointer', textDecoration: 'none'
            }}>
              <Search size={15} />
            </Link>
            <button onClick={toggle} style={{
              width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${solid ? 'var(--brd)' : 'rgba(255,255,255,.2)'}`,
              background: solid ? 'var(--surface2)' : 'rgba(255,255,255,.08)',
              color: solid ? 'var(--tx3)' : 'rgba(255,255,255,.7)'
            }}>
              {dark ? <Sun size={15}/> : <Moon size={15}/>}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href={dashLink} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, color: solid ? 'var(--tx2)' : 'rgba(255,255,255,.8)', textDecoration: 'none', transition: 'all .15s' }}>
                  <LayoutDashboard size={14}/>لوحتي
                </Link>
                <Link href="/profile">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand)', cursor: 'pointer', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : (profile?.full_name?.[0] || 'ط')}
                  </div>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/auth/login" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: solid ? 'var(--tx2)' : 'rgba(255,255,255,.8)', textDecoration: 'none' }}>
                  دخول
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>
                  سجّل مجاناً
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="md:hidden">
            <button onClick={toggle} style={{ width: 32, height: 32, borderRadius: 7, cursor: 'pointer', border: `1px solid ${solid ? 'var(--brd)' : 'rgba(255,255,255,.2)'}`, background: solid ? 'var(--surface2)' : 'rgba(255,255,255,.1)', color: solid ? 'var(--tx3)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {dark ? <Sun size={14}/> : <Moon size={14}/>}
            </button>
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: solid ? 'var(--tx1)' : '#fff', display: 'flex', padding: 4 }}>
              {open ? <X size={21}/> : <Menu size={21}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)}>
          <div style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--nav-border)', padding: '12px 20px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: 'var(--sh3)' }} onClick={e => e.stopPropagation()}>
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href} className={`nav-link${pathname===href?' active':''}`} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/search" className="nav-link" onClick={() => setOpen(false)}><Search size={14}/>بحث</Link>
            <div style={{ height: 1, background: 'var(--brd)', margin: '6px 0' }}/>
            {user ? (<>
              <Link href={dashLink} className="nav-link" onClick={() => setOpen(false)}><LayoutDashboard size={14}/>لوحتي</Link>
              <button className="nav-link danger" style={{ background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', textAlign: 'right' }}
                onClick={async () => { await supabase.auth.signOut(); setOpen(false); window.location.href = '/' }}>
                <LogOut size={14}/>خروج
              </button>
            </>) : (<>
              <Link href="/auth/login"    className="nav-link" onClick={() => setOpen(false)}>تسجيل دخول</Link>
              <Link href="/auth/register" className="btn btn-primary btn-md btn-full" style={{ textDecoration: 'none', marginTop: 6 }} onClick={() => setOpen(false)}>سجّل مجاناً</Link>
            </>)}
          </div>
        </div>
      )}
    </>
  )
}
