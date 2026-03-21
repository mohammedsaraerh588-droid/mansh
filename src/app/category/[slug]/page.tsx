'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import CourseCard from '@/components/courses/CourseCard'
import { Loader2, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<any>(null)
  const [courses,  setCourses]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle()
      if (!cat) { setLoading(false); return }
      setCategory(cat)

      const { data: crs } = await supabase
        .from('courses')
        .select('*, teacher:profiles(full_name)')
        .eq('category_id', cat.id)
        .eq('status', 'published')
        .order('total_students', { ascending: false })
      setCourses(crs || [])
      setLoading(false)
    })()
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 size={32} className="spin" style={{ color: 'var(--brand)' }}/>
    </div>
  )
  if (!category) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: 'var(--tx3)', fontSize: 16 }}>التصنيف غير موجود</p>
      <Link href="/courses" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>تصفح الدورات</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      <div className="hero" style={{ padding: '52px 0 48px' }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.6)', fontSize: 13, marginBottom: 16, textDecoration: 'none' }}>
            <ArrowRight size={14}/>الدورات
          </Link>
          <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 900, color: '#fff', letterSpacing: '-.02em', marginBottom: 8 }}>
            {category.icon && <span style={{ marginLeft: 10 }}>{category.icon}</span>}
            {category.name_ar || category.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 15 }}>
            {courses.length} دورة في هذا التصنيف
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36 }}>
        {courses.length === 0 ? (
          <div className="card" style={{ padding: 56, textAlign: 'center' }}>
            <BookOpen size={32} style={{ color: 'var(--tx4)', margin: '0 auto 14px' }}/>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx1)', marginBottom: 8 }}>لا توجد دورات في هذا التصنيف حالياً</h3>
            <p style={{ color: 'var(--tx3)', fontSize: 14, marginBottom: 18 }}>سيتم إضافة دورات قريباً</p>
            <Link href="/courses" className="btn btn-primary btn-md" style={{ textDecoration: 'none', display: 'inline-flex' }}>تصفح كل الدورات</Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(c => <CourseCard key={c.id} course={c}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
