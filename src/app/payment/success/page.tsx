'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, BookOpen, LayoutDashboard, Loader2 } from 'lucide-react'

function SuccessContent() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    setTimeout(() => setDone(true), 800)
  }, [])

  if (!done) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <Loader2 size={36} className="spin" style={{ color: 'var(--brand)' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,.15)', border: '2px solid rgba(16,185,129,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 32px rgba(16,185,129,.2)' }}>
        <CheckCircle size={40} style={{ color: 'var(--ok)' }} />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--tx1)', marginBottom: 8, letterSpacing: '-.02em' }}>تم التسجيل بنجاح!</h1>
      <p style={{ fontSize: 15, color: 'var(--tx3)', marginBottom: 28, lineHeight: 1.75 }}>
        أنت الآن مسجّل في الدورة ويمكنك البدء بالتعلم مباشرةً.
      </p>
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24, textAlign: 'right' }}>
        {['تم تأكيد عملية الدفع', 'تم إضافة الدورة لحسابك', 'ستصلك رسالة تأكيد على بريدك'].map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ok)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--tx2)', fontWeight: 600 }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/dashboard/student/courses" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
          <BookOpen size={16} />دوراتي
        </Link>
        <Link href="/dashboard/student" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
          <LayoutDashboard size={16} />لوحة التحكم
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Loader2 size={36} className="spin" style={{ color: 'var(--brand)' }} />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
