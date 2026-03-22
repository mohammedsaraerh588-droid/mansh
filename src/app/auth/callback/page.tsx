'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const handleCallback = async () => {
      // نستخرج الـ tokens من الـ URL hash
      const hash = window.location.hash
      const params = new URLSearchParams(hash.replace('#', ''))
      const access_token  = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const type          = params.get('type')

      if (access_token && refresh_token) {
        // نضع الـ session في Supabase
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error || !session) {
          router.push('/auth/login?error=invalid_token')
          return
        }

        // نجلب دور المستخدم ونوجّهه للصفحة الصحيحة
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', session.user.id).single()

        const role = profile?.role
        if (role === 'admin')        router.push('/dashboard/admin')
        else if (role === 'teacher') router.push('/dashboard/teacher')
        else                         router.push('/dashboard/student')
      } else {
        // لا يوجد token — ارجع لتسجيل الدخول
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'var(--bg)', gap:16,
    }}>
      <Loader2 size={36} className="spin" style={{color:'var(--alpha-green)'}}/>
      <p style={{fontSize:15, color:'var(--tx3)', fontWeight:600}}>
        جاري تأكيد حسابك...
      </p>
    </div>
  )
}
