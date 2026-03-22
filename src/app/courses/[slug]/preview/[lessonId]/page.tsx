import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowRight, Lock } from 'lucide-react'
import Link from 'next/link'
import VideoPlayer from '@/components/ui/VideoPlayer'
import DOMPurify from 'isomorphic-dompurify'

export default async function LessonPreviewPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id,title,type,content,video_url,cloudinary_public_id,is_preview,modules(courses(id,title,slug,thumbnail_url))')
    .eq('id', lessonId)
    .eq('is_preview', true)
    .single()

  if (!lesson) notFound()

  const course = (lesson.modules as any)?.courses

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:48 }}>
      {/* Top bar */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--brd)', padding:'12px 0' }}>
        <div className="wrap" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <Link href={`/courses/${slug}`} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--tx3)', textDecoration:'none' }}>
            <ArrowRight size={14}/>العودة للدورة
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'var(--alpha-green-l)', color:'var(--alpha-green-2)', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:5, border:'1px solid var(--alpha-green-m)' }}>
              معاينة مجانية
            </span>
            <Link href={`/courses/${slug}`} className="btn-register" style={{ textDecoration:'none', padding:'7px 16px', fontSize:13 }}>
              سجّل للوصول الكامل
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap-md" style={{ paddingTop:32 }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:'var(--tx1)', marginBottom:20, letterSpacing:'-.02em' }}>
          {lesson.title}
        </h1>

        {/* Video */}
        {lesson.type === 'video' ? (
          <VideoPlayer
            publicId={lesson.cloudinary_public_id}
            url={lesson.video_url}
            title={lesson.title}/>
        ) : (
          <div style={{ padding:24, background:'var(--surface)', border:'1px solid var(--brd)', borderRadius:12, minHeight:200, lineHeight:1.8, color:'var(--tx1)', fontSize:15 }}>
            {lesson.content
              ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(lesson.content)}}/>
              : <p style={{ color:'var(--tx3)' }}>لا يوجد محتوى.</p>}
          </div>
        )}

        {/* Enroll CTA */}
        <div style={{ marginTop:28, background:'linear-gradient(135deg,#1B5E20,#2E7D32)', borderRadius:14, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
              <Lock size={15} style={{ color:'rgba(255,255,255,.6)' }}/>
              <span style={{ fontSize:12, color:'rgba(255,255,255,.6)', fontWeight:600 }}>باقي الدروس مقفلة</span>
            </div>
            <p style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:2 }}>
              {course?.title}
            </p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.55)' }}>
              سجّل الآن للوصول الكامل لجميع الدروس
            </p>
          </div>
          <Link href={`/courses/${slug}`} className="btn-register" style={{ textDecoration:'none', padding:'12px 28px', fontSize:15 }}>
            عرض الدورة كاملة
          </Link>
        </div>
      </div>
    </div>
  )
}
