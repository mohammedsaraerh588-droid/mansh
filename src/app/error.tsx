'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // تسجيل الخطأ بهدوء (يمكن إضافة Sentry هنا لاحقاً)
    console.error('[500]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{maxWidth: 460, width: '100%', textAlign: 'center'}}>

        {/* أيقونة الخطأ */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--warn-bg)',
          border: '2px solid rgba(217,119,6,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <AlertTriangle size={38} style={{color: 'var(--warn)'}}/>
        </div>

        <h1 style={{fontSize: 28, fontWeight: 900, color: 'var(--tx1)', marginBottom: 10, letterSpacing: '-.02em'}}>
          حدث خطأ مؤقت
        </h1>

        <p style={{fontSize: 15, color: 'var(--tx3)', lineHeight: 1.85, marginBottom: 28}}>
          عذراً، حدث خطأ غير متوقع في الخادم.
          المشكلة مؤقتة وستُحل قريباً. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية.
        </p>

        <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
          <button
            onClick={reset}
            className="btn-register"
            style={{padding: '10px 24px', fontSize: 14}}
          >
            <RefreshCw size={15}/>حاول مجدداً
          </button>
          <Link
            href="/"
            className="btn btn-outline btn-lg"
            style={{textDecoration: 'none'}}
          >
            <Home size={15}/>الصفحة الرئيسية
          </Link>
        </div>

        {/* كود الخطأ — مخفي من المستخدم لكن مفيد للتطوير */}
        {error.digest && (
          <p style={{marginTop: 24, fontSize: 11, color: 'var(--tx4)', fontFamily: 'monospace'}}>
            كود الخطأ: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
