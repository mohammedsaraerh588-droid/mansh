'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { 
  Home, BookOpen, LayoutDashboard, LogOut, Menu, X, 
  Sun, Moon, Stethoscope, ChevronDown, User, Users, MessageCircle
} from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileOpen, setProfileOpen] = useState(false)
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
      if (s?.user) {
        supabase.from('profiles').select('*').eq('id', s.user.id).single().then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClick = () => setProfileOpen(false)
    if (profileOpen) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [profileOpen])

  const isHero = pathname === '/'
  const solid = scrolled || !isHero
  const dashLink = !profile 
    ? '/dashboard/student' 
    : profile.role === 'admin' 
      ? '/dashboard/admin' 
      : profile.role === 'teacher' 
        ? '/dashboard/teacher' 
        : '/dashboard/student'

  const links = pathname === '/'
    ? [
        { label: 'الرئيسية', href: '/', I: Home },
        { label: 'التخصصات', href: '/#stages', I: BookOpen },
        { label: 'المعلمون', href: '/#instructors', I: Users },
        { label: 'الأسئلة الشائعة', href: '/#faq', I: MessageCircle },
        { label: 'الدورات الطبية', href: '/courses', I: BookOpen },
      ]
    : [
        { label: 'الرئيسية', href: '/', I: Home },
        { label: 'الدورات الطبية', href: '/courses', I: BookOpen },
      ]

  const lc = (a: boolean) => solid 
    ? (a ? 'var(--brand)' : 'var(--tx2)') 
    : (a ? '#fff' : 'rgba(255,255,255,0.7)')

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        background: solid ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: solid ? '1px solid var(--nav-border)' : 'none',
        boxShadow: solid ? 'var(--nav-shadow)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: solid ? '0' : '0'
      }}>
        <div className="wrap" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: solid ? 64 : 72,
          transition: 'height 0.35s ease'
        }}>
          
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--sh-brand)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.08) rotate(-3deg)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0deg)'
            }}>
              <Stethoscope size={20}/>
            </div>
            <div style={{lineHeight: 1.1}}>
              <span style={{
                fontSize: 16,
                fontWeight: 900,
                color: solid ? 'var(--tx1)' : '#fff',
                transition: 'color 0.3s ease',
                display: 'block'
              }}>
                منصة تعلّم
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--brand)',
                letterSpacing: '.06em',
                textTransform: 'uppercase'
              }}>
                Medical Education
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }} className="hidden md:flex">
            {links.map(({label, href, I}) => (
              <Link 
                key={href} 
                href={href} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  color: lc(pathname === href),
                  background: pathname === href && solid 
                    ? 'var(--brand-light)' 
                    : 'transparent'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = solid 
                    ? 'var(--surface-2)' 
                    : 'rgba(255,255,255,0.1)'
                  ;(e.currentTarget as HTMLElement).style.color = solid 
                    ? 'var(--tx1)' 
                    : '#fff'
                }}
                onMouseLeave={e => {
                  if (pathname !== href) {
                    (e.currentTarget as HTMLElement).style.background = pathname === href && solid 
                      ? 'var(--brand-light)' 
                      : 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = lc(pathname === href)
                  }
                }}
              >
                <I size={15}/>
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }} className="hidden md:flex">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggle}
              title={dark ? 'الوضع الفاتح' : 'الوضع المظلم'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 10,
                cursor: 'pointer',
                border: '1.5px solid var(--brd)',
                background: solid ? 'var(--surface)' : 'rgba(255,255,255,0.1)',
                color: solid ? 'var(--tx1)' : '#fff',
                fontSize: 13,
                fontWeight: 700,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--brand)'
                ;(e.currentTarget as HTMLElement).style.background = 'var(--brand-light)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--brd)'
                ;(e.currentTarget as HTMLElement).style.color = solid ? 'var(--tx1)' : '#fff'
                ;(e.currentTarget as HTMLElement).style.background = solid ? 'var(--surface)' : 'rgba(255,255,255,0.1)'
              }}
            >
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>

            {user ? (
              <>
                <Link 
                  href={dashLink} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 16px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    color: lc(false),
                    background: solid ? 'transparent' : 'rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--brand-light)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--brand)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = solid ? 'transparent' : 'rgba(255,255,255,0.1)'
                    ;(e.currentTarget as HTMLElement).style.color = lc(false)
                  }}
                >
                  <LayoutDashboard size={15}/>
                  لوحة التحكم
                </Link>

                {/* Profile Dropdown */}
                <div style={{position: 'relative'}}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setProfileOpen(!profileOpen)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px 6px 6px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: '1.5px solid var(--brd)',
                      background: 'var(--surface)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--sh-brand)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--brd)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--brand)'
                    }}>
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="" 
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--gradient)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: 13,
                          color: '#fff'
                        }}>
                          {profile?.full_name?.[0] ?? 'د'}
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--tx1)'
                    }}>
                      {profile?.full_name?.split(' ')[0] || 'حسابي'}
                    </span>
                    <ChevronDown 
                      size={14} 
                      style={{
                        color: 'var(--tx3)',
                        transition: 'transform 0.2s ease',
                        transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: 200,
                      background: 'var(--surface)',
                      border: '1px solid var(--brd)',
                      borderRadius: 16,
                      boxShadow: 'var(--sh4)',
                      padding: 8,
                      zIndex: 1000
                    }}>
                      <Link 
                        href="/profile" 
                        className="nav-link"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={15}/>
                        الملف الشخصي
                      </Link>
                      <div style={{height: 1, background: 'var(--brd)', margin: '6px 8px'}}/>
                      <button 
                        className="nav-link danger"
                        onClick={async () => {
                          await supabase.auth.signOut()
                          setProfileOpen(false)
                          window.location.href = '/'
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'right',
                          fontFamily: 'inherit'
                        }}
                      >
                        <LogOut size={15}/>
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    transition: 'color 0.2s ease',
                    color: lc(false)
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand)')}
                  onMouseLeave={e => (e.currentTarget.style.color = lc(false))}
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn btn-primary btn-md"
                  style={{textDecoration: 'none'}}
                >
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }} className="md:hidden">
            <button 
              onClick={toggle}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: solid ? 'var(--tx1)' : '#fff',
                padding: 8,
                display: 'flex'
              }}
            >
              {dark ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button 
              onClick={() => setOpen(!open)} 
              style={{
                background: solid ? 'var(--surface-2)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
                color: solid ? 'var(--tx1)' : '#fff',
                padding: 10,
                display: 'flex',
                borderRadius: 10,
                backdropFilter: 'blur(10px)'
              }}
            >
              {open ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)'
        }} onClick={() => setOpen(false)}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--nav-border)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxShadow: 'var(--sh4)'
          }}
          onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12
            }}>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none'
              }} onClick={() => setOpen(false)}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Stethoscope size={18}/>
                </div>
                <span style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: 'var(--tx1)'
                }}>
                  منصة تعلّم
                </span>
              </Link>
              <button 
                onClick={() => setOpen(false)}
                style={{
                  background: 'var(--surface-2)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--tx1)',
                  padding: 8,
                  display: 'flex',
                  borderRadius: 8
                }}
              >
                <X size={20}/>
              </button>
            </div>

            {/* Links */}
            {links.map(({label, href, I}) => (
              <Link 
                key={href} 
                href={href} 
                className={`nav-link ${pathname === href ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <I size={18}/>
                {label}
              </Link>
            ))}

            <div style={{height: 1, background: 'var(--brd)', margin: '8px 0'}}/>

            {user ? (
              <>
                <Link 
                  href={dashLink} 
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={18}/>
                  لوحة التحكم
                </Link>
                <Link 
                  href="/profile" 
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  <User size={18}/>
                  الملف الشخصي
                </Link>
                <button 
                  className="nav-link danger"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setOpen(false)
                    window.location.href = '/'
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    fontFamily: 'inherit'
                  }}
                >
                  <LogOut size={18}/>
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginTop: 4
              }}>
                <Link 
                  href="/auth/login" 
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn btn-primary btn-full"
                  style={{textDecoration: 'none'}}
                  onClick={() => setOpen(false)}
                >
                  ابدأ مجاناً
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
