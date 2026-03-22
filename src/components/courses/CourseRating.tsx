'use client'
import { useState, useEffect } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'

interface Props { courseId: string; isEnrolled: boolean }

export default function CourseRating({ courseId, isEnrolled }: Props) {
  const [reviews,    setReviews]    = useState<any[]>([])
  const [myRating,   setMyRating]   = useState<any>(null)
  const [hover,      setHover]      = useState(0)
  const [selected,   setSelected]   = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [done,       setDone]       = useState(false)

  useEffect(() => {
    fetch(`/api/rating?courseId=${courseId}`)
      .then(r => r.json())
      .then(d => {
        setReviews(d.reviews || [])
        if (d.myRating) { setMyRating(d.myRating); setSelected(d.myRating.rating); setReviewText(d.myRating.review || '') }
        setLoading(false)
      })
      .catch(e => { console.error('[RATING_LOAD]', e); setLoading(false) })
  }, [courseId])

  const submit = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, rating: selected, review: reviewText }),
      })
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (e) {
      console.error('[RATING_SUBMIT]', e)
    } finally {
      setSaving(false)
    }
  }

  const stars = (n: number, size = 16) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={size}
      style={{ color: i < n ? '#F59E0B' : 'var(--tx4)', fill: i < n ? '#F59E0B' : 'none' }}/>
  ))

  if (loading) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* إضافة تقييم */}
      {isEnrolled && (
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx1)', marginBottom: 14 }}>
            {myRating ? 'تعديل تقييمك' : 'قيّم الدورة'}
          </h3>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, cursor: 'pointer' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={28}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setSelected(i + 1)}
                style={{ color: i < (hover || selected) ? '#F59E0B' : 'var(--tx4)', fill: i < (hover || selected) ? '#F59E0B' : 'none', transition: 'all .1s' }}/>
            ))}
          </div>
          <textarea className="inp" rows={3} style={{ resize: 'none', marginBottom: 10 }}
            placeholder="شارك رأيك بالدورة (اختياري)..."
            value={reviewText} onChange={e => setReviewText(e.target.value)}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={submit} disabled={!selected || saving} className="btn btn-primary btn-md">
              {saving ? <Loader2 size={14} className="spin"/> : done ? <CheckCircle size={14}/> : <Star size={14}/>}
              {done ? 'تم الحفظ!' : 'حفظ التقييم'}
            </button>
          </div>
        </div>
      )}

      {/* قائمة التقييمات */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx1)' }}>آراء الطلاب ({reviews.length})</h3>
          {reviews.map((r: any, i: number) => (
            <div key={i} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {r.profiles?.full_name?.[0] || 'ط'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx1)' }}>{r.profiles?.full_name || 'طالب'}</div>
                  <div style={{ display: 'flex', gap: 2 }}>{stars(r.rating, 12)}</div>
                </div>
              </div>
              {r.review && <p style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>{r.review}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
