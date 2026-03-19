'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Award, Video, BarChart, FileText, Settings, Users, LogOut, Loader2 } from 'lucide-react'

const NAV = {
  student: [
    { label:'لوحتي',    href:'/dashboard/student',              Icon:LayoutDashboard },
    { label:'دوراتي',   href:'/dashboard/student/courses',      Icon:BookOpen },
    { label:'شهاداتي',  href:'/dashboard/student/certificates', Icon:Award },
  ],
  teacher: [
    { label:'لوحة التحكم',   href:'/dashboard/teacher',         Icon:LayoutDashboard },
    { label:'إدارة الدورات', href:'/dashboard/teacher/courses', Icon:Video },
    { label:'المبيعات',      href:'/dashboard/teacher/sales',   Icon:BarChart },
    { label:'الاختبارات',    href:'/dashboard/teacher/quizzes', Icon:FileText },
  ],
  admin: [
    { label:'نظرة عامة',  href:'/dashboard/admin',         Icon:LayoutDashboard },
    { label:'المستخدمون', href:'/dashboard/admin/users',   Icon:Users },
    { label:'الإيرادات',  href:'/dashboard/admin/revenue', Icon:BarChart },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role,    setRole]    = useState<'student'|'teacher'|'admin'|null>(null)
  const [loading, setLoading] = useState(true)
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return }
      supabase.from('profiles').select('role').eq('id', session.user.id).single()
        .then(({ data }) => { setRole((data?.role as any) ?? 'student'); setLoading(false) })
    })
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 size={32} className="spin text-mint opacity-50"/>
    </div>
  )

  const items = role ? NAV[role] : []

  return (
    <div className="bg-bg min-h-screen pt-24 pb-12">
      <div className="wrap flex flex-col md:flex-row gap-8 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-64 flex-shrink-0 sticky top-28 z-10">
          <div className="card p-4 shadow-xl shadow-navy/5">
            <div className="px-3 pb-3 mb-3 border-b border-border">
                <span className="text-[10px] font-black text-navy opacity-30 tracking-[0.2em] uppercase">القائمة الرئيسية</span>
            </div>
            <nav className="flex flex-col gap-1.5">
              {items.map(({label,href,Icon})=>{
                const active = pathname===href || (pathname.startsWith(href+'/') && !['/dashboard/student','/dashboard/teacher','/dashboard/admin'].includes(href))
                return (
                  <Link key={href} href={href} className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group',
                    active 
                      ? 'bg-navy text-white shadow-lg shadow-navy/20' 
                      : 'text-txt2 hover:bg-navy/5'
                  )}>
                    <Icon size={16} className={cn(active ? 'text-mint' : 'text-navy/40 group-hover:text-navy')} />
                    {label}
                  </Link>
                )
              })}
              
              <div className="h-px bg-border my-3 mx-2" />
              
              <Link href="/profile" className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group',
                pathname === '/profile' ? 'bg-navy text-white shadow-lg' : 'text-txt2 hover:bg-navy/5'
              )}>
                <Settings size={16} className={cn(pathname === '/profile' ? 'text-mint' : 'text-navy/40 group-hover:text-navy')} />
                إعدادات الحساب
              </Link>
              
              <button 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-err hover:bg-err/5 transition-all w-full text-right"
                onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}
              >
                <LogOut size={16} className="opacity-60" />
                تسجيل الخروج
              </button>
            </nav>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 fade-up">
          <div className="mb-6 invisible md:visible">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-[10px] font-bold text-navy/40 tracking-wider">
                <LayoutDashboard size={12} /> لوحة التحكم / {items.find(i => i.href === pathname)?.label || 'نظرة عامة'}
             </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

