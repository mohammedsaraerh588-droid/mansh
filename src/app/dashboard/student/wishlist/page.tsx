'use client'
import { useEffect, useState } from 'react'
import { Heart, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import CourseCard from '@/components/courses/CourseCard'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist').then(r => r.json()).then(d => {
      setWishlist(d.wishlist || [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <Loader2 size={28} className="spin" style={{ color: 'var(--brand)' }}/>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 5 }}>الطالب</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--tx1)', letterSpacing: '-.02em' }}>قائمة المفضلة</h1>
        <p style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 3 }}>الدورات التي حفظتها للرجوع إليها لاحقاً</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Heart size={26} style={{ color: '#EF4444' }}/>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--tx1)' }}>قائمتك فارغة</h3>
          <p style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 20 }}>تصفّح الدورات وأضف ما يعجبك للمفضلة بالضغط على أيقونة القلب.</p>
          <Link href="/courses" className="btn btn-primary btn-md" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <BookOpen size={15}/>تصفّح الدورات
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {wishlist.map((w: any) => w.courses && <CourseCard key={w.course_id} course={w.courses}/>)}
        </div>
      )}
    </div>
  )
}
