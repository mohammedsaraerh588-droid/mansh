'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CourseCard from '@/components/courses/CourseCard'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { 
  Play, BookOpen, Award, Users, Clock, Shield, Brain, 
  Check, Star, ChevronRight, ArrowLeft, Stethoscope,
  Target, Heart, MessageCircle, Globe, Lock, UserPlus,
  GraduationCap, BadgeCheck, TrendingUp, PlayCircle,
  Menu, X, Home, FileText, Phone, Info, ExternalLink
} from 'lucide-react'

// Clean Features - No Fake Data
const features = [
  {
    icon: BookOpen,
    title: 'محتوى طبي للطلاب الجامعيين',
    description: 'دورات مبنية على منهج دراسي واضح في العلوم الطبية والمهارات السريرية الأساسية.',
    color: '#14b8a6'
  },
  {
    icon: Award,
    title: 'شهادات إتمام',
    description: 'احصل على شهادة رقمية معتمدة عند إنهاء كل دورة.',
    color: '#6366f1'
  },
  {
    icon: Brain,
    title: 'اختبارات تفاعلية',
    description: 'اختبر معلوماتك بعد كل وحدة مع تغذية راجعة فورية.',
    color: '#0ea5e9'
  },
  {
    icon: Shield,
    title: 'محتوى موثّق',
    description: 'جميع المحتويات مراجعة من قبل أساتذة متخصصين.',
    color: '#059669'
  }
]

export default function CleanHome() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [latestCourses, setLatestCourses] = useState<any[]>([])
  const [stats, setStats] = useState({ courses: 0, teachers: 0, learners: 0 })

  useEffect(() => {
    const run = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('id,name_ar').order('name_ar')
        setCategories(cats || [])

        const { data: tchs } = await supabase
          .from('profiles')
          .select('id,full_name,avatar_url,headline')
          .eq('role', 'teacher')
          .limit(8)
        setTeachers(tchs || [])

        const { data: latest } = await supabase
          .from('courses')
          .select('id,title,slug,thumbnail_url,duration_hours,level,total_lessons,price,currency,avg_rating,total_reviews,total_students,category_id, category:categories(name_ar)')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3)
        setLatestCourses(latest || [])

        const [{ count: cCnt }, { count: tCnt }, { count: lCnt }] = await Promise.all([
          supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
          supabase.from('enrollments').select('id', { count: 'exact', head: true }),
        ])

        setStats({
          courses: cCnt || 0,
          teachers: tCnt || 0,
          learners: lCnt || 0,
        })
      } catch {
        // If RLS or schema differs, keep the UI usable with empty arrays.
      }
    }
    run()
  }, [])

  const goToCourses = () => {
    const q = search.trim()
    if (!q) return router.push('/courses')
    router.push(`/courses?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="clean-home">
      
      {/* ═══════════════════════════════════════════════════════════
          NAVIGATION - Responsive
      ═══════════════════════════════════════════════════════════ */}
      <nav className="clean-nav">
        <div className="nav-container">
          <div className="nav-inner">
            {/* Logo */}
            <Link href="/" className="nav-logo">
              <div className="logo-icon">
                <Stethoscope size={20} />
              </div>
              <div className="logo-text">
                <span className="logo-name">منصة تعلّم</span>
                <span className="logo-tag">Medical Education</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="nav-links">
              <Link href="/" className="nav-link active">
                <Home size={16} />
                الرئيسية
              </Link>
              <Link href="/courses" className="nav-link">
                <BookOpen size={16} />
                الدورات
              </Link>
              <Link href="/about" className="nav-link">
                <Info size={16} />
                عن المنصة
              </Link>
              <Link href="/contact" className="nav-link">
                <Phone size={16} />
                تواصل معنا
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="nav-auth">
              <Link href="/auth/login" className="btn-login">
                <Lock size={16} />
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" className="btn-register">
                <UserPlus size={16} />
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>


      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <BadgeCheck size={16} />
              منصة الطب للطلاب الجامعيين
            </div>
            
            <h1 className="hero-title">
              تعلّم العلوم الطبية
              <span className="gradient-text">بدقة علمية</span>
            </h1>
            
            <p className="hero-subtitle">
              منصة تعليمية طبية متخصصة لطلاب الجامعات — شروحات منهجية، دروس تفاعلية، وتقييمات تساعدك على الفهم والإتقان.
            </p>

            {/* Hero Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                goToCourses()
              }}
              style={{
                maxWidth: 620,
                margin: '0 auto 26px',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', display: 'flex' }}>
                  <BookOpen size={15} />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن درس أو تخصص..."
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 16px',
                    borderRadius: 12,
                    border: '1.5px solid rgba(255,255,255,0.16)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-hero-primary"
                style={{ padding: '14px 26px', border: 'none' }}
              >
                <ChevronRight size={18} />
                ابحث
              </button>
            </form>

            <div className="hero-actions">
              <Link href="/courses" className="btn-hero-primary">
                <GraduationCap size={20} />
                استكشف الدورات
              </Link>
              <Link href="/auth/register" className="btn-hero-secondary">
                <UserPlus size={18} />
                أنشئ حسابك مجاناً
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <Check size={16} />
                <span>محتوى معتمد</span>
              </div>
              <div className="trust-item">
                <Check size={16} />
                <span>أساتذة متخصصين</span>
              </div>
              <div className="trust-item">
                <Check size={16} />
                <span>تعلم 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <Target size={14} />
              لماذا نحن؟
            </div>
            <h2 className="section-title">
              تجربة تعليمية
              <span className="gradient-text"> استثنائية</span>
            </h2>
            <p className="section-subtitle">
              نقدّم لك محتوى طبي عالي الجودة مع أفضل الأساتذة المتخصصين
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div 
                  className="feature-icon"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`
                  }}
                >
                  <feature.icon size={28} style={{color: feature.color}} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          STAGES / SPECIALIZATIONS
      ═══════════════════════════════════════════════════════════ */}
      <section id="stages" style={{ padding: '88px 0 64px' }}>
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div className="section-badge">
              <Stethoscope size={14} />
              تخصصات طبية
            </div>
            <h2 className="section-title">
              مسارات جاهزة
              <span className="gradient-text"> للتعلّم الجامعي</span>
            </h2>
            <p className="section-subtitle">
              اختر تخصصك ثم ابدأ رحلتك: شروحات منظمة، أمثلة سريرية، واختبارات تقييمية.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {(categories.length ? categories.slice(0, 6) : []).map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?cat=${cat.id}`}
                className="card"
                style={{
                  padding: 18,
                  borderRadius: 20,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  background: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      background: 'var(--teal-soft)',
                      border: '1px solid rgba(13,148,136,.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={18} style={{ color: 'var(--teal)' }} />
                  </div>
                  <div style={{ fontWeight: 900, color: 'var(--tx1)' }}>{cat.name_ar}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--tx3)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section id="instructors" style={{ padding: '0 0 88px' }}>
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div className="section-badge">
              <Users size={14} />
              فريق المعلمين
            </div>
            <h2 className="section-title">
              تعلم من
              <span className="gradient-text"> متخصصين</span>
            </h2>
            <p className="section-subtitle">
              محتوى مُراجع ومصمم لطلاب الجامعات: من الفكرة إلى التطبيق.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {(teachers.length ? teachers.slice(0, 6) : []).map((t) => (
              <div
                key={t.id}
                className="card"
                style={{
                  padding: 18,
                  borderRadius: 20,
                  textAlign: 'center',
                  background: 'var(--surface)',
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 26,
                    background: t.avatar_url ? 'transparent' : 'var(--gradient)',
                    border: '1px solid rgba(20,184,166,.18)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: '0 10px 40px rgba(20,184,166,.10)',
                  }}
                >
                  {t.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Stethoscope size={30} style={{ color: '#fff' }} />
                  )}
                </div>

                <div style={{ fontWeight: 900, color: 'var(--tx1)', marginBottom: 6 }}>{t.full_name}</div>
                <div style={{ color: 'var(--tx3)', fontSize: 13.5, lineHeight: 1.6, minHeight: 44 }}>
                  {t.headline || 'مدرس متخصص'}
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <span className="badge badge-teal" style={{ fontSize: 11 }}>
                    محتوى طبي
                  </span>
                  <span className="badge badge-navy" style={{ fontSize: 11 }}>
                    اختبارات
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COURSES CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="courses-cta-section">
        <div className="section-container">
          <div className="courses-cta-card">
            <div className="cta-icon">
              <BookOpen size={40} />
            </div>
            <h2 className="cta-title">استكشف دوراتنا الطبية</h2>
            <p className="cta-desc">
              تصفح مجموعتنا من الدورات الطبية المتخصصة وابدأ رحلتك التعليمية اليوم
            </p>
            <Link href="/courses" className="btn-cta">
              <Play size={18} />
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          STATS + LATEST + FAQ (Alpha Sections)
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '88px 0 0' }}>
        <div className="section-container">
          <div
            className="card"
            style={{
              padding: 20,
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(20,184,166,.10) 0%, rgba(99,102,241,.10) 55%, rgba(14,165,233,.08) 100%)',
              border: '1px solid rgba(20,184,166,.18)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <div style={{ textAlign: 'center', padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, color: 'var(--teal)' }}>
                  <GraduationCap size={18} />
                  <span style={{ fontWeight: 900, color: 'var(--tx2)' }}>إحصائيات</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 1000, color: 'var(--tx1)', marginBottom: 6 }}>{stats.courses}</div>
                <div style={{ color: 'var(--tx3)', fontWeight: 800 }}>دورات منشورة</div>
              </div>
              <div style={{ textAlign: 'center', padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, color: 'var(--brand-2)' }}>
                  <Users size={18} />
                  <span style={{ fontWeight: 900, color: 'var(--tx2)' }}>فريق</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 1000, color: 'var(--tx1)', marginBottom: 6 }}>{stats.teachers}</div>
                <div style={{ color: 'var(--tx3)', fontWeight: 800 }}>معلم متخصص</div>
              </div>
              <div style={{ textAlign: 'center', padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, color: 'var(--teal2)' }}>
                  <Heart size={18} />
                  <span style={{ fontWeight: 900, color: 'var(--tx2)' }}>تعلم</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 1000, color: 'var(--tx1)', marginBottom: 6 }}>{stats.learners}</div>
                <div style={{ color: 'var(--tx3)', fontWeight: 800 }}>متعلمين عبر المنصة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0 0' }}>
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: 28 }}>
            <div className="section-badge">
              <TrendingUp size={14} />
              آخر الدورات
            </div>
            <h2 className="section-title">
              تحديثات
              <span className="gradient-text"> تعليمية</span>
            </h2>
            <p className="section-subtitle">أحدث ما نضيفه على منصتنا الطبية للطلاب.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {latestCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ padding: '64px 0 92px' }}>
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: 28 }}>
            <div className="section-badge">
              <MessageCircle size={14} />
              الأسئلة الشائعة
            </div>
            <h2 className="section-title">
              إجابات
              <span className="gradient-text"> واضحة</span>
            </h2>
            <p className="section-subtitle">كل ما تحتاجه لبدء التعلم بثقة.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                q: 'كيف أبدأ التعلم بشكل صحيح؟',
                a: 'حدد تخصصك ثم اختر دورة مناسبة، ثم اتبع ترتيب الدروس داخل المنصة مع الاختبارات التفاعلية.',
              },
              {
                q: 'هل المحتوى مناسب للطلاب الجامعيين؟',
                a: 'نعم. المحتوى مُنظم ليتماشى مع منهجيات دراسية واضحة مع أمثلة تطبيقية.',
              },
              {
                q: 'هل يوجد تقييم واختبارات؟',
                a: 'توجد اختبارات تقييمية حسب إعداد كل درس لمساعدتك على قياس فهمك.',
              },
              {
                q: 'كيف أتابع تقدمي؟',
                a: 'تظهر نسبة التقدم داخل صفحة التعلم ويتم تحديثها بعد إكمال الدروس.',
              },
            ].map((item, idx) => (
              <details key={idx} className="card" style={{ padding: 14, borderRadius: 20, background: 'var(--surface)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 900, color: 'var(--tx1)', listStyle: 'none' }}>{item.q}</summary>
                <div style={{ marginTop: 10, color: 'var(--tx2)', lineHeight: 1.85, fontSize: 14 }}>{item.a}</div>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              className="card"
              style={{
                padding: 20,
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                background: 'linear-gradient(135deg, rgba(20,184,166,.12) 0%, rgba(99,102,241,.10) 55%, rgba(14,165,233,.08) 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    background: 'var(--gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--sh-brand)',
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 1000, color: 'var(--tx1)', fontSize: 16, marginBottom: 4 }}>الدعم الفني جاهز لمساعدتك</div>
                  <div style={{ color: 'var(--tx3)', fontSize: 14, lineHeight: 1.6 }}>تواصل معنا وسنرد عليك بأقرب وقت.</div>
                </div>
              </div>
              <Link href="/contact" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                تواصل الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-shape shape-1"></div>
          <div className="cta-shape shape-2"></div>
        </div>
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              مستعد لبدء
              <span className="gradient-text">رحلتك الطبية؟</span>
            </h2>
            <p className="cta-desc">
              أنشئ حسابك مجاناً وابدأ التعلم الآن
            </p>
            <div className="cta-actions">
              <Link href="/auth/register" className="btn-cta-primary">
                <UserPlus size={20} />
                إنشاء حساب مجاني
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="clean-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="nav-logo">
                <div className="logo-icon">
                  <Stethoscope size={20} />
                </div>
                <div className="logo-text">
                  <span className="logo-name">منصة تعلّم</span>
                  <span className="logo-tag">Medical Education</span>
                </div>
              </Link>
              <p className="footer-desc">
                منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين.
              </p>
            </div>

            <div className="footer-links">
              <h4>روابط سريعة</h4>
              <Link href="/">الرئيسية</Link>
              <Link href="/courses">الدورات</Link>
              <Link href="/about">عن المنصة</Link>
              <Link href="/contact">تواصل معنا</Link>
            </div>

            <div className="footer-links">
              <h4>المعلومات</h4>
              <Link href="/terms">الشروط والأحكام</Link>
              <Link href="/privacy">سياسة الخصوصية</Link>
            </div>

            <div className="footer-links">
              <h4>الحساب</h4>
              <Link href="/auth/login">تسجيل الدخول</Link>
              <Link href="/auth/register">إنشاء حساب</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} منصة تعلّم الطبية — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>


      {/* ═══════════════════════════════════════════════════════════
          STYLES - Fully Responsive
      ═══════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── Base ───────────────────────────────────────────── */
        .clean-home {
          background: var(--bg);
          color: var(--tx1);
          min-height: 100vh;
        }

        /* ── Navigation ─────────────────────────────────────── */
        .clean-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: none; /* use global Navbar from RootLayout */
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .logo-text {
line-height: 1.2;
        }

        .logo-name {
          display: block;
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
        }

        .logo-tag {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: #667EEA;
          letter-spacing: 0.05em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: #0F172A;
          background: #F1F5F9;
        }

        .nav-link.active {
          color: #667EEA;
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-login {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
          transition: all 0.2s ease;
        }

        .btn-login:hover {
          color: #667EEA;
          background: rgba(102, 126, 234, 0.08);
        }

        .btn-register {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-register:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        /* ── Hero ─────────────────────────────────────────────── */
        .hero-section {
          position: relative;
          padding: 160px 0 100px;
          background: linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%);
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hero-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.4;
        }

        .shape-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 70%);
          top: -20%;
          right: -10%;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          bottom: -10%;
          left: -5%;
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          position: relative;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(20, 184, 166, 0.12);
          border: 1px solid rgba(20, 184, 166, 0.22);
          font-size: 13px;
          font-weight: 700;
          color: var(--brand);
          margin-bottom: 28px;
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 900;
          line-height: 1.15;
          color: var(--tx1);
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 50%, var(--teal2) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 18px);
          color: var(--tx3);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .btn-hero-primary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 12px;
          background: var(--gradient);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(20, 184, 166, 0.35);
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(20, 184, 166, 0.45);
        }

        .btn-hero-secondary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 12px;
          background: var(--surface);
          color: var(--tx1);
          font-size: 15px;
          font-weight: 700;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .btn-hero-secondary:hover {
          border-color: var(--brand);
          color: var(--brand);
          transform: translateY(-2px);
        }

        .hero-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748B;
        }

        .trust-item svg {
          color: #059669;
        }

        /* ── Features ───────────────────────────────────────── */
        .features-section {
          padding: 100px 0;
          background: #fff;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: var(--brand-light);
          border: 1px solid rgba(20, 184, 166, 0.22);
          font-size: 12px;
          font-weight: 800;
          color: var(--brand);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          color: var(--tx1);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 16px;
          color: var(--tx3);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .feature-card {
          padding: 32px 28px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          text-align: center;
          transition: all 0.4s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12);
          border-color: var(--brand);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 14px;
          color: #64748B;
          line-height: 1.7;
        }

        /* ── Courses CTA ─────────────────────────────────────── */
        .courses-cta-section {
          padding: 80px 0;
          background: #F8FAFC;
        }

        .courses-cta-card {
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .courses-cta-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .cta-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #fff;
        }

        .cta-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
        }

        .cta-desc {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          max-width: 500px;
          margin: 0 auto 32px;
          line-height: 1.7;
          position: relative;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 12px;
          background: #fff;
          color: #667EEA;
          font-size: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .btn-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
        }

        /* ── Final CTA ────────────────────────────────────────── */
        .cta-section {
          position: relative;
          padding: 100px 0;
          background: #fff;
          overflow: hidden;
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .cta-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.5;
        }

        .cta-section .shape-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
          top: -50%;
          right: 10%;
        }

        .cta-section .shape-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%);
          bottom: -30%;
          left: 10%;
        }

        .cta-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          position: relative;
        }

        .cta-content .cta-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 16px;
        }

        .cta-content .cta-desc {
          font-size: 18px;
          color: #64748B;
          margin-bottom: 36px;
        }

        .cta-actions {
          margin-bottom: 32px;
        }

        .btn-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
        }

        /* ── Footer ──────────────────────────────────────────── */
        .clean-footer {
          padding: 80px 0 40px;
          background: #0F172A;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand .nav-logo {
          margin-bottom: 20px;
        }

        .footer-brand .logo-icon {
          background: linear-gradient(135deg, #667EEA, #764BA2);
        }

        .footer-brand .logo-name {
          color: #fff;
        }

        .footer-desc {
          font-size: 14px;
          color: #64748B;
          line-height: 1.8;
          max-width: 280px;
        }

        .footer-links h4 {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .footer-links a {
          display: block;
          font-size: 14px;
          color: #64748B;
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: #667EEA;
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .footer-bottom p {
          font-size: 14px;
          color: #475569;
        }

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE - Desktop, Tablet, Mobile
        ═══════════════════════════════════════════════════════════ */
        
        /* Large Tablets & Small Laptops */
        @media (max-width: 1024px) {
          .nav-links {
            gap: 2px;
          }

          .nav-link {
            padding: 8px 12px;
            font-size: 13px;
          }

          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Tablets (iPad) */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .nav-auth {
            gap: 8px;
          }

          .btn-login {
            padding: 8px 14px;
            font-size: 13px;
          }

          .btn-login span {
            display: none;
          }

          .btn-register span {
            display: none;
          }

          .hero-section {
            padding: 140px 0 80px;
          }

          .hero-actions {
            flex-direction: column;
            gap: 12px;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            justify-content: center;
          }

          .hero-trust {
            gap: 20px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }

          .courses-cta-card {
            padding: 40px 24px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .nav-container {
            padding: 0 16px;
          }

          .nav-inner {
            height: 64px;
          }

          .logo-icon {
            width: 38px;
            height: 38px;
          }

          .logo-name {
            font-size: 16px;
          }

          .hero-container {
            padding: 0 16px;
          }

          .hero-badge {
            font-size: 12px;
            padding: 6px 14px;
          }

          .hero-trust {
            flex-direction: column;
            gap: 12px;
          }

          .trust-item {
            font-size: 13px;
          }

          .section-container {
            padding: 0 16px;
          }

          .features-section {
            padding: 80px 0;
          }

          .feature-card {
            padding: 24px 20px;
          }

          .cta-section {
            padding: 80px 0;
          }

          .footer-container {
            padding: 0 16px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-brand {
            grid-column: auto;
          }

          .footer-links {
            text-align: center;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .hero-title {
            font-size: 32px;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            padding: 14px 24px;
            font-size: 14px;
          }

          .btn-cta,
          .btn-cta-primary {
            padding: 14px 28px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
