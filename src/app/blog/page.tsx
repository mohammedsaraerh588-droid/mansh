'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { BookOpen, Clock, Stethoscope, Loader2, Search } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  const [posts,   setPosts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    supabase.from('blog_posts')
      .select('id,title,slug,excerpt,cover_image,published_at,read_time,author:profiles(full_name,avatar_url),category')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => { setPosts(data || []); setLoading(false) })
  }, [])

  const filtered = posts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:60 }}>
      {/* Hero */}
      <div className="hero" style={{ padding:'52px 0 48px', textAlign:'center' }}>
        <div className="wrap" style={{ position:'relative', zIndex:1 }}>
          <div className="eyebrow"><Stethoscope size={11}/>الأخبار والمقالات</div>
          <h1 style={{ fontSize:'clamp(24px,4vw,42px)', fontWeight:900, color:'#fff', letterSpacing:'-.02em', marginBottom:10 }}>
            مدونة تعلّم الطبية
          </h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:15, maxWidth:460, margin:'0 auto 24px' }}>
            أحدث الأخبار والمقالات الطبية والتعليمية
          </p>
          <div style={{ maxWidth:440, margin:'0 auto', position:'relative' }}>
            <Search size={15} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.4)', pointerEvents:'none' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="ابحث في المقالات..."
              style={{ width:'100%', padding:'11px 44px 11px 16px', borderRadius:10, border:'1.5px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.1)', color:'#fff', fontSize:14, outline:'none', fontFamily:'inherit' }}/>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop:36 }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
            <Loader2 size={32} className="spin" style={{ color:'var(--alpha-green)' }}/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding:60, textAlign:'center' }}>
            <BookOpen size={36} style={{ color:'var(--tx4)', margin:'0 auto 14px' }}/>
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--tx1)', marginBottom:8 }}>
              {search ? 'لا توجد مقالات مطابقة' : 'لا توجد مقالات بعد'}
            </h3>
            <p style={{ color:'var(--tx3)', fontSize:14 }}>سيتم نشر مقالات قريباً</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:22 }}>
            {filtered.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration:'none' }}>
                <div className="card" style={{ overflow:'hidden', transition:'all .2s', height:'100%' }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='var(--alpha-green-m)'}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='var(--brd)'}}>
                  <div style={{ height:180, background:p.cover_image?`url(${p.cover_image}) center/cover`:'linear-gradient(135deg,#1B5E20,#2E7D32)', position:'relative' }}>
                    {p.category && (
                      <span style={{ position:'absolute', top:12, right:12, background:'var(--alpha-green)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:6 }}>
                        {p.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding:'16px 18px' }}>
                    <h3 style={{ fontSize:15, fontWeight:800, color:'var(--tx1)', lineHeight:1.4, marginBottom:8, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p style={{ fontSize:13, color:'var(--tx3)', lineHeight:1.7, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        {p.excerpt}
                      </p>
                    )}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--brd)', fontSize:12, color:'var(--tx4)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--alpha-green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>
                          {p.author?.full_name?.[0] || 'م'}
                        </div>
                        <span>{p.author?.full_name || 'فريق التحرير'}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        {p.read_time && <span style={{ display:'flex', alignItems:'center', gap:3 }}><Clock size={11}/>{p.read_time} د</span>}
                        {p.published_at && <span>{new Date(p.published_at).toLocaleDateString('ar-SA')}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
