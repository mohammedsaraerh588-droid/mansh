import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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

const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return NextResponse.next({ request })

  // Get user role from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()
    .then(({ data, error }) => ({ data, error }))
  
  const role = profile?.role as 'student' | 'teacher' | 'admin' | null

  // Protected routes by role
  const isTeacher = role === 'teacher' 
  const isAdmin = role === 'admin'

  // Route protection
  const pathname = request.nextUrl.pathname

  // Any login required
  if (pathname.startsWith('/dashboard') || pathname === '/profile') {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Role-specific
  if (pathname.startsWith('/dashboard/teacher') && !isTeacher && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }
  
  if (pathname.startsWith('/dashboard/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }

  // Auth pages redirect to dashboard
  if (user && ['/auth/login', '/auth/register'].includes(pathname)) {
    const target = isAdmin ? '/dashboard/admin' : 
                  isTeacher ? '/dashboard/teacher' : '/dashboard/student'
    return NextResponse.redirect(new URL(target, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
