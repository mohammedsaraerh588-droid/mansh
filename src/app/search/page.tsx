'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Search, Loader2, BookOpen, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><span style={{color:'var(--brand)'}}>جاري التحميل...</span></div>}>
      <SearchContent/>
    </Suspense>
  )
}

function SearchContent() {
  const params  = useSearchParams()
  const q       = params.get('q') || ''
  const [query,   setQuery]   = useState(q)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [level,   setLevel]   = useState('all')
  const [price,   setPrice]   = useState('all')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => { if (q) doSearch(q) }, [q])

  const doSearch = async (term: string) => {
    if (!term.trim()) return
    setLoading(true)
    let query = supabase.from('courses')
      .select('*,category:categories(name_ar),teacher:profiles(full_name)')
      .in('status', ['published', 'draft'])
      .order('created_at', { ascending: false })

    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
    if (level !== 'all') query = query.eq('level', level)
    if (price === 'free') query = query.eq('price', 0)
    if (price === 'paid') query = query.gt('price', 0)

    const { data } = await query
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
        {/* Search bar */}
        <div className="hero" style={{ borderRadius: 16, padding: '36px 28px', marginBottom: 28 }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 20, textAlign: 'center', letterSpacing: '-.02em' }}>
              ابحث في الدورات الطبية
            </h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.4)', display: 'flex', pointerEvents: 'none' }}>
                  <Search size={16}/>
                </span>
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث عن تخصص أو موضوع طبي..."
                  style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}/>
              </div>
              <button type="submit" className="btn btn-primary btn-lg">بحث</button>
            </form>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['all','beginner','intermediate','advanced'].map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  style={{ padding: '5px 14px', borderRadius: 99, border: `1.5px solid ${level===l?'var(--brand)':'rgba(255,255,255,.2)'}`, background: level===l?'var(--brand)':'transparent', color: level===l?'#fff':'rgba(255,255,255,.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {l==='all'?'كل المستويات':l==='beginner'?'مبتدئ':l==='intermediate'?'متوسط':'متقدم'}
                </button>
              ))}
              <div style={{ width: 1, background: 'rgba(255,255,255,.15)', margin: '0 4px' }}/>
              {['all','free','paid'].map(p => (
                <button key={p} onClick={() => setPrice(p)}
                  style={{ padding: '5px 14px', borderRadius: 99, border: `1.5px solid ${price===p?'var(--brand)':'rgba(255,255,255,.2)'}`, background: price===p?'var(--brand)':'transparent', color: price===p?'#fff':'rgba(255,255,255,.6)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {p==='all'?'كل الأسعار':p==='free'?'مجاني':'مدفوع'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={32} className="spin" style={{ color: 'var(--brand)' }}/>
          </div>
        ) : q && results.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--tx1)', marginBottom: 8 }}>لا توجد نتائج لـ "{q}"</h3>
            <p style={{ color: 'var(--tx3)', fontSize: 14 }}>جرّب كلمات مختلفة أو تصفّح جميع الدورات</p>
            <Link href="/courses" className="btn btn-primary btn-md" style={{ textDecoration: 'none', display: 'inline-flex', marginTop: 16 }}>
              <BookOpen size={15}/>تصفّح الدورات
            </Link>
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 18 }}>{results.length} نتيجة لـ "{q}"</p>
            <div className="courses-grid">
              {results.map(c => <CourseCard key={c.id} course={c}/>)}
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
