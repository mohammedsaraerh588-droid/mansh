'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Search, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

const LEVELS = [
  { v: 'all', l: 'كل المستويات' },
  { v: 'beginner', l: 'مبتدئ' },
  { v: 'intermediate', l: 'متوسط' },
  { v: 'advanced', l: 'متقدم' },
]

function SearchContent() {
  const params  = useSearchParams()
  const q0      = params.get('q') || ''
  const [query,   setQuery]   = useState(q0)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [level,   setLevel]   = useState('all')
  const [price,   setPrice]   = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => { if (q0) doSearch(q0) }, [q0])

  const doSearch = async (term: string) => {
    if (!term.trim()) return
    setLoading(true)
    let q = supabase.from('courses')
      .select('*,category:categories(name_ar),teacher:profiles(full_name)')
      .eq('status', 'published')
    q = q.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
    if (level !== 'all') q = q.eq('level', level)
    if (price === 'free') q = q.eq('price', 0)
    if (price === 'paid') q = q.gt('price', 0)
    const { data } = await q.order('created_at', { ascending: false })
    setResults(data || [])
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`)
    doSearch(query)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 32, paddingBottom: 60 }}>
      <div className="wrap">
        <div className="hero" style={{ borderRadius: 16, padding: '36px 28px', marginBottom: 28 }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 20, textAlign: 'center', letterSpacing: '-.02em' }}>
              ابحث في الدورات الطبية
            </h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.4)', display: 'flex', pointerEvents: 'none' }}>
                  <Search size={16} />
                </span>
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث عن تخصص أو موضوع طبي..."
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">بحث</button>
            </form>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {LEVELS.map(l => (
                <button key={l.v} onClick={() => setLevel(l.v)}
                  style={{ padding: '5px 14px', borderRadius: 99, border: `1.5px solid ${level === l.v ? 'var(--brand)' : 'rgba(255,255,255,.2)'}`, background: level === l.v ? 'var(--brand)' : 'transparent', color: level === l.v ? '#fff' : 'rgba(255,255,255,.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {l.l}
                </button>
              ))}
              <div style={{ width: 1, background: 'rgba(255,255,255,.15)', margin: '0 4px' }} />
              {[{ v: 'all', l: 'كل الأسعار' }, { v: 'free', l: 'مجاني' }, { v: 'paid', l: 'مدفوع' }].map(p => (
                <button key={p.v} onClick={() => setPrice(p.v)}
                  style={{ padding: '5px 14px', borderRadius: 99, border: `1.5px solid ${price === p.v ? 'var(--brand)' : 'rgba(255,255,255,.2)'}`, background: price === p.v ? 'var(--brand)' : 'transparent', color: price === p.v ? '#fff' : 'rgba(255,255,255,.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={32} className="spin" style={{ color: 'var(--brand)' }} />
          </div>
        ) : q0 && results.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--tx1)', marginBottom: 8 }}>لا توجد نتائج</h3>
            <p style={{ color: 'var(--tx3)', fontSize: 14 }}>جرّب كلمات مختلفة أو تصفّح جميع الدورات</p>
            <Link href="/courses" className="btn btn-primary btn-md" style={{ textDecoration: 'none', display: 'inline-flex', marginTop: 16 }}>
              <BookOpen size={15} />تصفّح الدورات
            </Link>
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 18 }}>{results.length} نتيجة</p>
            <div className="courses-grid">
              {results.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--tx3)', fontSize: 15 }}>
            ابدأ بكتابة ما تبحث عنه...
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--brand)' }} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
