'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (err) { setError('تعذّر إرسال رابط الاسترداد. تأكد من البريد الإلكتروني.'); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{background:'var(--surface-2)'}}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{background:'var(--gradient-gold)',color:'var(--primary)'}}>م</div>
            <span className="text-xl font-black" style={{color:'var(--text-primary)'}}>منصة <span className="gradient-text">تعلّم</span></span>
          </Link>
        </div>

        <div className="glass-card p-8 scale-in">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'#d1fae5'}}>
                <CheckCircle className="w-8 h-8" style={{color:'#059669'}} />
              </div>
              <h2 className="text-2xl font-black mb-2" style={{color:'var(--text-primary)'}}>تم الإرسال!</h2>
              <p className="text-sm mb-6" style={{color:'var(--text-secondary)'}}>
                أرسلنا رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>. تحقق من بريدك الوارد.
              </p>
              <Link href="/auth/login">
                <button className="btn-gold w-full py-3 rounded-lg text-sm">العودة لتسجيل الدخول</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black mb-2" style={{color:'var(--text-primary)'}}>نسيت كلمة المرور؟</h1>
                <p className="text-sm" style={{color:'var(--text-secondary)'}}>أدخل بريدك الإلكتروني وسنرسل لك رابط الاسترداد.</p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm" style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca'}}>
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color:'var(--text-secondary)'}}>البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{color:'var(--text-muted)'}} />
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="input-field pr-10 text-left" dir="ltr"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : null}
                  {loading ? 'جاري الإرسال...' : 'إرسال رابط الاسترداد'}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-bold" style={{color:'var(--gold-dark)'}}>
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
