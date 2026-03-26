'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router  = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [msg,    setMsg]    = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        // استخرج الـ tokens من الـ URL hash
        const hash   = window.location.hash.replace('#', '')
        const params = new URLSearchParams(hash)
        const access_token  = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        const errorDesc     = params.get('error_description')

        // حالة خطأ في الرابط
        if (errorDesc) {
          setStatus('error')
          setMsg(errorDesc.includes('expired') ? 'انتهت صلاحية الرابط. يرجى التسجيل من جديد.' : 'رابط غير صالح.')
          return
        }

        if (!access_token || !refresh_token) {
          // قد يكون Supabase أرسل الـ code كـ query param بدلاً من hash
          const searchParams = new URLSearchParams(window.location.search)
          const code = searchParams.get('code')
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) { setStatus('error'); setMsg('فشل التحقق.'); return }
          } else {
            setStatus('error'); setMsg('رابط غير مكتمل.'); return
          }
        } else {
          // ضع الـ session مباشرة
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) { setStatus('error'); setMsg('فشل تسجيل الدخول.'); return }
        }

        // تأكيد الـ session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setStatus('error'); setMsg('لم يتم التحقق.'); return }

        setStatus('success')
        setMsg('تم التأكيد! جاري التوجيه...')

        // جلب الدور وتوجيه المستخدم
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', session.user.id).single()

        setTimeout(() => {
          const role = profile?.role
          if (role === 'admin')        router.replace('/dashboard/admin')
          else if (role === 'teacher') router.replace('/dashboard/teacher')
          else                         router.replace('/dashboard/student')
        }, 1500)

      } catch {
        setStatus('error')
        setMsg('حدث خطأ غير متوقع.')
      }
    }
    run()
  }, [])

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--bg)',gap:16,padding:24}}>

      {status === 'loading' && <>
        <Loader2 size={40} className="spin" style={{color:'var(--alpha-green)'}}/>
        <p style={{fontSize:16,color:'var(--tx3)',fontWeight:600}}>جاري تأكيد حسابك...</p>
      </>}

      {status === 'success' && <>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--ok-bg)',border:'2px solid var(--ok-brd)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <CheckCircle size={36} style={{color:'var(--ok)'}}/>
        </div>
        <h2 style={{fontSize:22,fontWeight:900,color:'var(--tx1)',margin:0}}>تم التأكيد بنجاح! 🎉</h2>
        <p style={{fontSize:15,color:'var(--tx3)',margin:0}}>{msg}</p>
        <Loader2 size={20} className="spin" style={{color:'var(--alpha-green)'}}/>
      </>}

      {status === 'error' && <>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--err-bg)',border:'2px solid var(--err-brd)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <XCircle size={36} style={{color:'var(--err)'}}/>
        </div>
        <h2 style={{fontSize:20,fontWeight:900,color:'var(--tx1)',margin:0}}>فشل التأكيد</h2>
        <p style={{fontSize:14,color:'var(--tx3)',margin:0,textAlign:'center'}}>{msg}</p>
        <a href="/auth/register" className="btn-register" style={{textDecoration:'none',marginTop:8,padding:'10px 24px'}}>
          سجّل من جديد
        </a>
      </>}
    </div>
  )
}
