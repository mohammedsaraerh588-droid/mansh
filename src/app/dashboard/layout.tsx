'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { BookOpen, Award, LayoutDashboard, Settings, Video, FileText, BarChart, LogOut, Loader2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        if (data) setRole(data.role as any)
      }
      setLoading(false)
    }
    fetchRole()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{color:'var(--gold)'}} />
      </div>
    )
  }

  const navItems = {
    student: [
      { name: 'لوحتي', href: '/dashboard/student', icon: LayoutDashboard },
      { name: 'دوراتي', href: '/dashboard/student/courses', icon: BookOpen },
      { name: 'شهاداتي', href: '/dashboard/student/certificates', icon: Award },
    ],
    teacher: [
      { name: 'لوحة التحكم', href: '/dashboard/teacher', icon: LayoutDashboard },
      { name: 'إدارة الدورات', href: '/dashboard/teacher/courses', icon: Video },
      { name: 'المبيعات والإحصاءات', href: '/dashboard/teacher/sales', icon: BarChart },
      { name: 'الاختبارات', href: '/dashboard/teacher/quizzes', icon: FileText },
    ],
    admin: [
      { name: 'نظرة عامة', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'المستخدمين', href: '/dashboard/admin/users', icon: Settings },
      { name: 'الإيرادات', href: '/dashboard/admin/revenue', icon: BarChart },
    ]
  }

  const currentNavItems = role ? navItems[role] : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass-card p-4 sticky top-24">
            <div className="mb-6 px-4">
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">القائمة الرئيسية</h2>
            </div>
            <nav className="flex flex-col gap-2">
              {currentNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
              <div className="h-px my-4 mx-4" style={{background:'var(--border)'}} />
              <Link
                href="/profile"
                className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                إعدادات الحساب
              </Link>
      <button onClick={handleSignOut} className="nav-item w-full text-right mt-2" style={{color:'#ef4444'}} onMouseEnter={e=>(e.currentTarget.style.background='#fef2f2')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <LogOut className="w-5 h-5 shrink-0" />
                تسجيل الخروج
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
