import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // حماية الصفحات التي تتطلب تسجيل دخول
  const requiresAuth =
    pathname.startsWith('/dashboard') ||
    pathname === '/profile' ||
    pathname.includes('/learn')

  if (requiresAuth && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // جلب دور المستخدم
  let role: 'student' | 'teacher' | 'admin' | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle()
    role = (profile?.role as typeof role) ?? 'student'
  }

  // حماية صفحات المعلم
  if (pathname.startsWith('/dashboard/teacher')) {
    if (role !== 'teacher' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }
  }

  // حماية صفحات الأدمن
  if (pathname.startsWith('/dashboard/admin')) {
    if (role !== 'admin') {
      const target = role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  // إعادة توجيه المسجّل دخوله بعيداً عن صفحات Auth
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const target =
      role === 'admin'   ? '/dashboard/admin' :
      role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'
    return NextResponse.redirect(new URL(target, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/data).*)'],
}
