
import Image from 'next/legacy/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import { Home, BookOpen, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Stethoscope } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [profile,  setProfile]  = useState<any>(null)
  const pathname  = usePathname()
  const supabase  = createSupabaseBrowserClient()
  const { theme, toggle } = useTheme()
  const dark    = theme === 'dark'
  const isHero  = pathname === '/'
  const solid   = scrolled || !isHero

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

  const dashLink = !profile ? '/dashboard/student'
    : profile.role==='admin'   ? '/dashboard/admin'
    : profile.role==='teacher' ? '/dashboard/teacher'
    : '/dashboard/student'

  const links = [
    { label:'الرئيسية',     href:'/',        I:Home },
    { label:'الدورات الطبية', href:'/courses', I:BookOpen },
  ]

  return (
    <>
    <nav className={cn(
      'fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out',
      solid 
        ? 'py-3 bg-nav-bg backdrop-blur-xl border-b border-nav-border shadow-lg shadow-navy/5' 
        : 'py-6 bg-transparent'
    )}>
      <div className="wrap flex items-center justify-between gap-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg',
            solid ? 'bg-navy text-white shadow-navy/20' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
          )}>
            <Stethoscope size={20}/>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className={cn('text-lg font-black tracking-tight transition-colors duration-300', solid ? 'text-navy' : 'text-white')}>
              منصة <span className={cn('italic font-serif transition-colors', solid ? 'text-navy3' : 'text-mint')}>تعلّم</span>
            </div>
            <div className={cn('text-[9px] font-bold tracking-[0.2em] uppercase opacity-50', solid ? 'text-navy' : 'text-white')}>
              Medical Excellence
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center bg-navy/5 p-1 rounded-2xl border border-navy/5 backdrop-blur-sm"
             style={{ background: !solid ? 'rgba(255,255,255,0.05)' : undefined }}>
          {links.map(({label,href,I})=>{
            const active = pathname===href
            return (
              <Link key={href} href={href} className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                active 
                  ? (solid ? 'bg-white text-navy shadow-sm' : 'bg-white/10 text-mint shadow-inner')
                  : (solid ? 'text-navy/60 hover:text-navy hover:bg-white/50' : 'text-white/60 hover:text-white hover:bg-white/10')
              )}>
                <I size={14} className={cn(active && !solid && 'text-mint')} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* ── Actions ── */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggle} className={cn(
            'p-2.5 rounded-xl border transition-all duration-300 hover:scale-105',
            solid 
              ? 'bg-white border-border text-navy shadow-sm' 
              : 'bg-white/5 border-white/10 text-white/80'
          )}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href={dashLink} className={cn(
                'hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                solid ? 'text-navy hover:bg-navy/5' : 'text-white/80 hover:bg-white/10'
              )}>
                <LayoutDashboard size={14}/> لوحة التحكم
              </Link>
              <Link href="/profile" className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-mint p-0.5 shadow-lg group-hover:scale-105 transition-transform">
{profile?.avatar_url
                    ? <Image src={profile.avatar_url} alt="Avatar" width={40} height={40} className="w-full h-full object-cover rounded-lg"/>
                    : <div className="w-full h-full bg-navy flex items-center justify-center font-black text-white text-sm rounded-lg">
                        {profile?.full_name?.[0] ?? 'د'}
                      </div>}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className={cn(
                'px-4 py-2 text-xs font-bold transition-colors',
                solid ? 'text-navy/60 hover:text-navy' : 'text-white/60 hover:text-white'
              )}>
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" className={cn(
                'btn btn-md shadow-lg',
                solid ? 'btn-primary' : 'btn-white !text-navy'
              )}>
                ابدأ رحلتك مجاناً
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Trigger ── */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggle} className={cn(
            'p-2 rounded-lg border',
            solid ? 'bg-white border-border text-navy' : 'bg-white/5 border-white/10 text-white'
          )}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(!open)} className={cn(
            'p-1 transition-colors',
            solid ? 'text-navy' : 'text-white'
          )}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>

    {/* ── Mobile Drawer ── */}
    {open && (
      <div className="fixed inset-0 z-[99] bg-navy/20 backdrop-blur-md animate-in fade-in transition-all" onClick={()=>setOpen(false)}>
        <div className="absolute top-[80px] left-4 right-4 bg-white dark:bg-navy rounded-3xl p-6 shadow-2xl border border-navy/5 animate-in slide-in-from-top-4 duration-300" 
             onClick={e=>e.stopPropagation()}>
          <div className="flex flex-col gap-2">
            {links.map(({label,href,I})=>(
              <Link key={href} href={href} 
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all',
                  pathname===href ? 'bg-navy/5 text-navy dark:bg-white/5 dark:text-mint' : 'text-txt2 hover:bg-navy/5'
                )}
                onClick={()=>setOpen(false)}>
                <I size={18}/>{label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                <Link href={dashLink} className="flex items-center gap-4 p-4 rounded-2xl text-sm font-bold text-txt2 hover:bg-navy/5" onClick={()=>setOpen(false)}>
                  <LayoutDashboard size={18}/> لوحة التحكم
                </Link>
                <button className="flex items-center gap-4 p-4 rounded-2xl text-sm font-bold text-err hover:bg-err/5 w-full text-right"
                  onClick={async()=>{await supabase.auth.signOut();setOpen(false);window.location.href='/'}}>
                  <LogOut size={18}/> تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link href="/auth/login" className="btn btn-ghost btn-lg w-full" onClick={()=>setOpen(false)}>تسجيل الدخول</Link>
                <Link href="/auth/register" className="btn btn-primary btn-lg w-full shadow-xl" onClick={()=>setOpen(false)}>ابدأ مجاناً</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}

