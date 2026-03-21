'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import {
  Stethoscope, BookOpen, PlayCircle, Award, ChevronLeft,
  Brain, FlaskConical, Heart, Eye, Pill, Microscope,
  CheckCircle, Users, Clock, Star, ArrowLeft
} from 'lucide-react'

const SUBJECTS = [
  { icon: '🫀', name: 'أمراض القلب',       color: '#FEE2E2', tc: '#991B1B' },
  { icon: '🧠', name: 'طب الأعصاب',        color: '#EDE9FE', tc: '#5B21B6' },
  { icon: '🦷', name: 'طب الأسنان',        color: '#ECFDF5', tc: '#065F46' },
  { icon: '💊', name: 'الصيدلة السريرية',  color: '#EFF6FF', tc: '#1E40AF' },
  { icon: '🧬', name: 'علم الأحياء الجزيئي', color: '#FDF4FF', tc: '#6B21A8' },
  { icon: '🫁', name: 'أمراض الصدر',       color: '#F0FDF4', tc: '#166534' },
  { icon: '🩺', name: 'طب الطوارئ',        color: '#FFF7ED', tc: '#9A3412' },
  { icon: '🔬', name: 'علم الأمراض',       color: '#F0F9FF', tc: '#075985' },
]

const WHY = [
  { icon: <BookOpen size={20}/>, t: 'محتوى أكاديمي دقيق',    d: 'كل مادة مُعدّة وفق المناهج الطبية المعتمدة من متخصصين معتمدين.' },
  { icon: <PlayCircle size={20}/>, t: 'شرح بالفيديو التفاعلي', d: 'دروس مرئية واضحة مع إمكانية المراجعة في أي وقت ومن أي مكان.' },
  { icon: <CheckCircle size={20}/>, t: 'اختبارات بعد كل درس',   d: 'أسئلة MCQ تفاعلية لقياس الفهم الفوري مع مراجعة الإجابات.' },
  { icon: <Award size={20}/>, t: 'شهادة إتمام معتمدة',   d: 'شهادة رقمية تُصدر تلقائياً عند إكمال الدورة بنجاح.' },
]

export default function Home() {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    const sb = createSupabaseBrowserClient()
    sb.from('courses')
      .select('id,title,slug,thumbnail_url,price,currency,level,total_lessons,avg_rating,total_students,profiles(full_name)')
      .eq('status', 'published')
      .order('total_students', { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setCourses(data) })
  }, [])

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ══════════ HERO ══════════ */}
      <section className="hero" style={{ padding: '88px 0 72px' }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>

            {/* Left content */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="eyebrow" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }}>
                <Stethoscope size={11} />منصة التعليم الطبي الأكاديمي
              </div>
              <h1 style={{ fontSize: 'clamp(30px,5vw,54px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-.025em', marginBottom: 18 }}>
                تعلّم المواد الطبية<br />
                <span style={{ color: '#7DD3FC' }}>بأسلوب أكاديمي واضح</span>
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.65)', lineHeight: 1.85, marginBottom: 32, maxWidth: 460 }}>
                دورات طبية شاملة تشمل جميع التخصصات — من الفسيولوجيا والتشريح إلى الأمراض السريرية
                — بشرح مبسّط وتمارين تفاعلية.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/courses" className="btn btn-primary btn-xl" style={{ textDecoration: 'none', background: '#1A73E8', boxShadow: '0 4px 18px rgba(26,115,232,.5)' }}>
                  <PlayCircle size={18} />ابدأ التعلم مجاناً
                </Link>
                <Link href="/about" className="btn btn-xl" style={{ textDecoration: 'none', background: 'rgba(255,255,255,.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,.25)' }}>
                  اعرف المزيد <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

            {/* Right — stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minWidth: 280 }}>
              {[
                { n: 'دورات طبية', sub: 'في جميع التخصصات', icon: '📚' },
                { n: 'دروس مرئية', sub: 'شرح واضح بالفيديو',  icon: '🎬' },
                { n: 'اختبارات',   sub: 'بعد كل وحدة دراسية', icon: '✅' },
                { n: 'شهادات',     sub: 'عند إكمال الدورة',   icon: '🏆' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '18px 16px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SUBJECTS ══════════ */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--brd)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx1)', letterSpacing: '-.01em' }}>التخصصات الطبية</h2>
              <p style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 4 }}>اختر تخصصك وابدأ التعلم</p>
            </div>
            <Link href="/courses" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>
              كل الدورات <ChevronLeft size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12 }}>
            {SUBJECTS.map((s, i) => (
              <Link key={i} href={`/courses?subject=${encodeURIComponent(s.name)}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: s.color, border: `1.5px solid ${s.tc}22`, borderRadius: 12, padding: '18px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all .18s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sh2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.tc, lineHeight: 1.3 }}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COURSES ══════════ */}
      {courses.length > 0 && (
        <section style={{ padding: '56px 0', borderBottom: '1px solid var(--brd)' }}>
          <div className="wrap">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx1)', letterSpacing: '-.01em' }}>الدورات المتاحة</h2>
                <p style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 4 }}>استكشف الدورات الطبية المنشورة</p>
              </div>
              <Link href="/courses" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>
                عرض الكل <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="courses-grid">
              {courses.map((c: any) => (
                <Link key={c.id} href={`/courses/${c.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card card-hover" style={{ overflow: 'hidden' }}>
                    <div style={{ height: 150, background: c.thumbnail_url ? `url(${c.thumbnail_url}) center/cover` : 'linear-gradient(135deg,#1A1F3A,#0E2954)', position: 'relative' }}>
                      {c.price === 0 && (
                        <span style={{ position: 'absolute', top: 10, right: 10, background: '#16A34A', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5 }}>مجاني</span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx1)', marginBottom: 6, lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>{c.profiles?.full_name || 'معلم'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--tx3)' }}>
                          <BookOpen size={12} />{c.total_lessons || 0} درس
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: c.price === 0 ? 'var(--ok)' : 'var(--brand)' }}>
                          {c.price === 0 ? 'مجاني' : `${c.price} ${c.currency || 'USD'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ WHY ══════════ */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--brd)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="eyebrow">لماذا نختارنا</div>
            <h2 className="sec-title">منصة صُمّمت للطالب الطبي</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
            {WHY.map(({ icon, t, d }, i) => (
              <div key={i} className="card" style={{ padding: '24px 22px', borderTop: '3px solid var(--brand)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--brand-l)', border: '1px solid var(--brand-m)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: 'var(--brand)' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx1)', marginBottom: 8, letterSpacing: '-.01em' }}>{t}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--tx3)', lineHeight: 1.75 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding: '60px 0' }}>
        <div className="wrap">
          <div style={{ background: 'linear-gradient(135deg,#1A1F3A 0%,#0E2954 100%)', borderRadius: 18, padding: '52px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 0%,rgba(26,115,232,.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(26,115,232,.3)', border: '1px solid rgba(26,115,232,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Stethoscope size={26} style={{ color: '#7DD3FC' }} />
              </div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-.02em' }}>
                ابدأ رحلتك الأكاديمية الطبية
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.8 }}>
                سجّل الآن وابدأ بالدورات المجانية — لا يتطلب بطاقة ائتمان.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/register" className="btn btn-xl" style={{ textDecoration: 'none', background: '#1A73E8', color: '#fff', boxShadow: '0 4px 18px rgba(26,115,232,.5)' }}>
                  إنشاء حساب مجاني
                </Link>
                <Link href="/courses" className="btn btn-xl" style={{ textDecoration: 'none', background: 'rgba(255,255,255,.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,.2)' }}>
                  <BookOpen size={16} />استكشف الدورات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: '1px solid var(--brd)', padding: '28px 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={15} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--tx1)' }}>منصة تعلّم الطبية</span>
          </div>
          <nav style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--tx3)', flexWrap: 'wrap' }}>
            {[['الدورات','/courses'],['من نحن','/about'],['تواصل معنا','/contact'],['الشروط','/terms'],['الخصوصية','/privacy']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color: 'var(--tx3)' }}>{l}</Link>
            ))}
          </nav>
          <span style={{ fontSize: 12, color: 'var(--tx4)' }}>© 2026 منصة تعلّم الطبية</span>
        </div>
      </footer>

    </div>
  )
}
