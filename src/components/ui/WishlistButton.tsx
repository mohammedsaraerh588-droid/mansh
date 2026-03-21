'use client'
import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'

export default function WishlistButton({ courseId }: { courseId: string }) {
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist').then(r => r.json()).then(d => {
      const ids = (d.wishlist || []).map((w: any) => w.course_id)
      setSaved(ids.includes(courseId))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [courseId])

  const toggle = async () => {
    setLoading(true)
    const r = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
    const d = await r.json()
    setSaved(d.action === 'added')
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      title={saved ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
      style={{
        width: 38, height: 38, borderRadius: 9, cursor: 'pointer',
        border: `1.5px solid ${saved ? '#FCA5A5' : 'var(--brd2)'}`,
        background: saved ? '#FEF2F2' : 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
      {loading
        ? <Loader2 size={15} className="spin" style={{ color: 'var(--tx3)' }}/>
        : <Heart size={16} style={{ color: saved ? '#EF4444' : 'var(--tx3)', fill: saved ? '#EF4444' : 'none' }}/>}
    </button>
  )
}
