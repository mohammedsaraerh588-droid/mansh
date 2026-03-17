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

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile']
  const teacherRoutes = ['/dashboard/teacher']
  const adminRoutes = ['/dashboard/admin']

  const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (user && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
