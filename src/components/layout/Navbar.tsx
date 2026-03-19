'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { 
  Home, BookOpen, LayoutDashboard, LogOut, Menu, X, 
  Stethoscope, GraduationCap, User, Sparkles
} from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      }
    }
    getSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dashboardLink = !profile ? '/dashboard/student'
    : profile.role === 'admin' ? '/dashboard/admin'
    : profile.role === 'teacher' ? '/dashboard/teacher'
    : '/dashboard/student'

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'الدورات', href: '/courses', icon: BookOpen },
    { name: 'لوحة التحكم', href: user ? dashboardLink : '/auth/login', icon: LayoutDashboard },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg' 
            : 'bg-white/60 backdrop-blur-md border-b border-gray-100/30'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  منصة الطبيب
                </span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-500">التعليم الطبي المتقدم</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-full">
                      <div className="bg-white p-0.5 rounded-full">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.role === 'admin' ? 'bg-red-100 text-red-700' :
                      profile?.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {profile?.role === 'admin' ? 'مدير' :
                       profile?.role === 'teacher' ? 'معلم' : 'طالب'}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      تسجيل الدخول
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/auth/register"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      إنشاء حساب
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-40"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {profile?.full_name || user.email}
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        profile?.role === 'admin' ? 'bg-red-100 text-red-700' :
                        profile?.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {profile?.role === 'admin' ? 'مدير' :
                         profile?.role === 'teacher' ? 'معلم' : 'طالب'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">تسجيل الخروج</span>
                  </button>
                </div>
              )}

              {!user && (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block mx-4 bg-gradient-to-r from-blue-500 to-purple-500 text-center text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
