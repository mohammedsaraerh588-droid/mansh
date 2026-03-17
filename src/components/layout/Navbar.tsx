'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { LayoutDashboard, LogOut, Menu, X, BookOpen, Home, Sparkles } from 'lucide-react'

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      } else { setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'الدورات', href: '/courses', icon: BookOpen },
  ]

  const isHeroPage = pathname === '/'

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled || !isHeroPage
        ? 'bg-white/95 backdrop-blur-xl border-b border-border shadow-sm py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{background:'var(--gradient-1)'}}>
            م
          </div>
          <span className={`text-xl font-black transition-colors ${isScrolled || !isHeroPage ? 'text-secondary' : 'text-white'}`}>
            منصة <span className="gradient-text">تعلّم</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-primary-light text-primary'
                    : isScrolled || !isHeroPage
                      ? 'text-text-secondary hover:text-primary hover:bg-surface-2'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className={`flex items-center gap-3 pr-6 border-r ${isScrolled || !isHeroPage ? 'border-border' : 'border-white/20'}`}>
            {user ? (
              <>
                <Link href={getDashboardLink()}>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isScrolled || !isHeroPage ? 'text-text-secondary hover:text-primary hover:bg-surface-2' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة التحكم
                  </button>
                </Link>
                <Link href="/profile">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition-all hover:scale-105 cursor-pointer shadow-sm">
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-sm font-black text-white" style={{background:'var(--gradient-1)'}}>
                          {profile?.full_name?.[0] || 'أ'}
                        </div>
                    }
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isScrolled || !isHeroPage ? 'text-text-secondary hover:text-primary hover:bg-surface-2' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>تسجيل الدخول</button>
                </Link>
                <Link href="/auth/register">
                  <button className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl">
                    <Sparkles className="w-4 h-4" />
                    ابدأ مجاناً
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled || !isHeroPage ? 'text-text-secondary hover:bg-surface-2' : 'text-white hover:bg-white/10'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border p-4 flex flex-col gap-2 shadow-xl">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-colors ${
                pathname === link.href ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-surface-2'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}>
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface-2">
                  <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                </button>
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> تسجيل الخروج
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full p-3 rounded-xl text-sm font-bold text-text-secondary border-2 border-border hover:border-primary hover:text-primary transition-all">تسجيل الدخول</button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-primary w-full p-3 text-sm rounded-xl flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> ابدأ مجاناً
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
