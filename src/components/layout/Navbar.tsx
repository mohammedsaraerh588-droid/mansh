'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { BookOpen, User, BookMarked, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

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
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الدورات', href: '/courses' },
  ]

  const getDashboardLink = () => {
    if (!profile) return '/dashboard/student'
    switch (profile.role) {
      case 'admin': return '/dashboard/admin'
      case 'teacher': return '/dashboard/teacher'
      default: return '/dashboard/student'
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-border py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-sm transition-all duration-300 transform group-hover:-translate-y-1">
            م
          </div>
          <span className="text-xl font-bold tracking-tight text-secondary">
            منصة <span className="text-primary">تعلّم</span>
          </span>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-r border-border pr-6">
            {user ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" className="text-text-secondary hover:text-primary-dark group">
                    <LayoutDashboard className="w-4 h-4 ml-2 group-hover:text-primary transition-colors" />
                    لوحة التحكم
                  </Button>
                </Link>
                <div className="relative group">
                  <Link href="/profile">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-light group-hover:border-primary transition-colors cursor-pointer">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-2 flex items-center justify-center text-sm font-bold text-primary">
                          {profile?.full_name ? profile.full_name[0] : 'أ'}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">تسجيل الدخول</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary">حساب جديد</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-text-secondary hover:text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-100 left-0 w-full bg-white border-b border-border p-4 flex flex-col gap-4 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href ? 'bg-primary-light text-primary-dark' : 'text-text-secondary hover:bg-surface-2'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-start">
                  <LayoutDashboard className="w-4 h-4 ml-2" />
                  لوحة التحكم
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start mt-2">
                  <User className="w-4 h-4 ml-2" />
                  الملف الشخصي
                </Button>
              </Link>
              <Button variant="danger" className="w-full justify-start mt-2" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full">تسجيل الدخول</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">حساب جديد</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
