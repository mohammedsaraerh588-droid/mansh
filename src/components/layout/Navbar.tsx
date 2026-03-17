'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, LogOut, Menu, X, BookOpen, Home } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()

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
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      } else setProfile(null)
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
    if (profile.role === 'admin') return '/dashboard/admin'
    if (profile.role === 'teacher') return '/dashboard/teacher'
    return '/dashboard/student'
  }

  const isHero = pathname === '/'
  const scrolled = isScrolled || !isHero

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'الدورات', href: '/courses', icon: BookOpen },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'py-3 shadow-md'
        : 'py-5'
    }`}
      style={{
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}>
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base transition-transform duration-300 group-hover:scale-105"
            style={{background:'var(--gradient-gold)', color:'var(--primary)'}}>
            م
          </div>
          <span className={`text-lg font-black tracking-tight transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}>
            منصة <span className="gradient-text">تعلّم</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                pathname === link.href
                  ? scrolled ? 'text-primary' : 'text-white'
                  : scrolled ? 'text-text-secondary hover:text-primary hover:bg-surface-2' : 'text-white/65 hover:text-white hover:bg-white/10'
              }`}
              style={pathname === link.href ? {borderBottom:'2px solid var(--gold)', paddingBottom:'6px'} : {}}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href={getDashboardLink()}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  scrolled ? 'text-text-secondary hover:text-primary hover:bg-surface-2' : 'text-white/65 hover:text-white hover:bg-white/10'
                }`}>
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </button>
              </Link>
              <Link href="/profile">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer"
                  style={{borderColor:'var(--gold)'}}>
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-sm font-black"
                        style={{background:'var(--gradient-gold)', color:'var(--primary)'}}>
                        {profile?.full_name?.[0] || 'أ'}
                      </div>
                  }
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  scrolled ? 'text-text-secondary hover:text-primary' : 'text-white/70 hover:text-white'
                }`}>تسجيل الدخول</button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg">
                  ابدأ مجاناً
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-text-primary hover:bg-surface-2' : 'text-white hover:bg-white/10'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-1 shadow-lg" style={{borderColor:'var(--border)'}}>
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold ${
                pathname === link.href ? 'text-primary' : 'text-text-secondary hover:bg-surface-2'
              }`}
              style={pathname === link.href ? {background:'var(--gold-bg)'} : {}}
              onClick={() => setIsMobileMenuOpen(false)}>
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <div className="h-px my-2" style={{background:'var(--border)'}} />
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold text-text-secondary hover:bg-surface-2">
                  <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                </button>
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> تسجيل الخروج
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full p-3 rounded-lg text-sm font-bold text-text-secondary border" style={{borderColor:'var(--border)'}}>تسجيل الدخول</button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-gold w-full p-3 text-sm rounded-lg">ابدأ مجاناً</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
