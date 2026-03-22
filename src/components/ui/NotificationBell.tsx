'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, BellDot, CheckCheck, BookOpen, Award, Info } from 'lucide-react'

export default function NotificationBell() {
  const [open,  setOpen]  = useState(false)
  const [notifs, setNotifs] = useState<any[]>([])
  const ref = useRef<HTMLDivElement>(null)

  const unread = notifs.filter(n => !n.is_read).length

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => setNotifs(d.notifications || []))
      .catch(e => console.error('[NOTIF_BELL]', e))
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const markAll = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      setNotifs(p => p.map(n => ({ ...n, is_read: true })))
    } catch (e) { console.error('[NOTIF_MARK]', e) }
  }

  const icon = (type: string) => {
    if (type === 'course') return <BookOpen size={14} style={{ color: 'var(--brand)' }}/>
    if (type === 'certificate') return <Award size={14} style={{ color: 'var(--ok)' }}/>
    return <Info size={14} style={{ color: 'var(--tx3)' }}/>
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
        border: '1px solid var(--brd)', background: 'var(--surface2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--tx3)', position: 'relative'
      }}>
        {unread > 0 ? <BellDot size={16} style={{ color: 'var(--brand)' }}/> : <Bell size={16}/>}
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -3, left: -3, width: 16, height: 16, borderRadius: '50%', background: 'var(--err)', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 320, background: 'var(--surface)', border: '1px solid var(--brd)', borderRadius: 12, boxShadow: 'var(--sh3)', zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--brd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx1)' }}>الإشعارات {unread > 0 && `(${unread})`}</span>
            {unread > 0 && (
              <button onClick={markAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand)', fontFamily: 'inherit', fontWeight: 600 }}>
                <CheckCheck size={13}/>قراءة الكل
              </button>
            )}
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--tx3)', fontSize: 13 }}>
                <Bell size={24} style={{ margin: '0 auto 10px', opacity: .4 }}/>
                لا توجد إشعارات
              </div>
            ) : notifs.map(n => (
              <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid var(--brd)', background: n.is_read ? 'transparent' : 'var(--brand-l)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}>{icon(n.type)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--tx1)', fontWeight: n.is_read ? 400 : 600, lineHeight: 1.5 }}>{n.message}</p>
                  <p style={{ fontSize: 11, color: 'var(--tx4)', marginTop: 3 }}>
                    {new Date(n.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0, marginTop: 5 }}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
