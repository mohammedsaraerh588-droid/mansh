'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, LogOut, Menu, X, BookOpen, Home, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false)
  const [isMobileMenuOpen, setMobileMenu] = useState(false)
  const [user, setUser]                   = useState<any>(null)
  const [profile, setProfile]             = useState<any>(null)
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      }
    }
    fetchUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
      if (session?.user)
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getDashboardLink = () => {
    if (!profile) return '/dashboard/student'
    if (profile.role === 'admin')   return '/dashboard/admin'
    if (profile.role === 'teacher') return '/dashboard/teacher'
    return '/dashboard/student'
  }

  const isHero    = pathname === '/'
  const scrolled  = isScrolled || !isHero

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'الدورات',  href: '/courses', icon: BookOpen },
  ]

  /* text color helpers */
  const linkColor = (active: boolean) =>
    scrolled
      ? active ? 'var(--gold-dark)' : 'var(--text-secondary)'
      : active ? '#fff' : 'rgba(255,255,255,0.65)'

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        background:   scrolled ? 'var(--navbar-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--navbar-border)' : 'none',
        boxShadow:    scrolled ? 'var(--shadow-sm)' : 'none',
        padding:      scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'var(--gradient-gold)', color: '#1a1a2e' }}
          >م</div>
          <span className="text-lg font-black tracking-tight transition-colors duration-300"
            style={{ color: scrolled ? 'var(--text-primary)' : '#fff' }}>
            منصة <span className="gradient-text">تعلّم</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                color: linkColor(pathname === link.href),
                background: pathname === link.href && scrolled ? 'var(--gold-bg)' : 'transparent',
                borderBottom: pathname === link.href ? '2px solid var(--gold)' : '2px solid transparent',
              }}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* ── Desktop actions ── */}
        <div className="hidden md:flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="theme-toggle"
            title={isDark ? 'الوضع الفاتح' : 'الوضع المظلم'}
            style={{ justifyContent: isDark ? 'flex-end' : 'flex-start' }}
          >
            <span className="theme-toggle-knob">
              {isDark ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-amber-800" />}
            </span>
          </button>

          {user ? (
            <>
              <Link href={getDashboardLink()}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--gold-dark)'; (e.currentTarget as HTMLElement).style.background='var(--gold-bg)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color= scrolled ? 'var(--text-secondary)':'rgba(255,255,255,0.65)'; (e.currentTarget as HTMLElement).style.background='transparent' }}>
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </button>
              </Link>
              <Link href="/profile">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer"
                  style={{ borderColor: 'var(--gold)' }}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-sm font-black"
                        style={{ background: 'var(--gradient-gold)', color: '#1a1a2e' }}>
                        {profile?.full_name?.[0] || 'أ'}
                      </div>
                  }
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)' }}>
                  تسجيل الدخول
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-gold px-5 py-2.5 text-sm rounded-lg">ابدأ مجاناً</button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile: toggle + menu ── */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="theme-toggle"
            style={{ justifyContent: isDark ? 'flex-end' : 'flex-start' }}>
            <span className="theme-toggle-knob">
              {isDark ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-amber-800" />}
            </span>
          </button>
          <button className="p-2 rounded-lg transition-colors"
            style={{ color: scrolled ? 'var(--text-primary)' : '#fff' }}
            onClick={() => setMobileMenu(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 flex flex-col gap-1 shadow-lg"
          style={{ background: 'var(--navbar-bg)', borderTop: '1px solid var(--navbar-border)' }}>
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-colors"
              style={{
                color: pathname === link.href ? 'var(--gold-dark)' : 'var(--text-secondary)',
                background: pathname === link.href ? 'var(--gold-bg)' : 'transparent',
              }}
              onClick={() => setMobileMenu(false)}>
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <div className="h-px my-2" style={{ background: 'var(--border)' }} />
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setMobileMenu(false)}>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold"
                  style={{ color: 'var(--text-secondary)' }}>
                  <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                </button>
              </Link>
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold"
                style={{ color: '#f87171' }}>
                <LogOut className="w-4 h-4" /> تسجيل الخروج
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/auth/login" onClick={() => setMobileMenu(false)}>
                <button className="w-full p-3 rounded-lg text-sm font-bold border"
                  style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                  تسجيل الدخول
                </button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenu(false)}>
                <button className="btn-gold w-full p-3 text-sm rounded-lg">ابدأ مجاناً</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
