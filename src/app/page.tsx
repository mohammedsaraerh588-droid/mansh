'use client'
import Link from 'next/link'
import { 
  BookOpen, CheckCircle, ArrowLeft, Stethoscope, GraduationCap,
  ShieldCheck, Activity, Brain, PlayCircle, Users, Sparkles,
  Clock, Award, Target, ChevronRight, Star, Heart
} from 'lucide-react'

const features = [
  { 
    I: BookOpen, 
    t: 'محتوى طبي متخصص', 
    d: 'دورات في مختلف التخصصات الطبية مقدَّمة بأسلوب علمي واضح وسهل الفهم.',
    color: '#6366F1'
  },
  { 
    I: ShieldCheck, 
    t: 'شهادات إتمام', 
    d: 'احصل على شهادة إتمام رقمية معتمدة عند إنهاء كل دورة بنجاح.',
    color: '#8B5CF6'
  },
  { 
    I: Brain, 
    t: 'اختبارات تفاعلية', 
    d: 'اختبر معلوماتك بعد كل وحدة عبر أسئلة تفاعلية مع تغذية راجعة فورية.',
    color: '#06B6D4'
  },
  { 
    I: Activity, 
    t: 'حالات سريرية', 
    d: 'تعلّم من خلال حالات سريرية واقعية تساعدك على ربط النظرية بالتطبيق.',
    color: '#10B981'
  },
  { 
    I: Target, 
    t: 'محتوى نصي وفيديو', 
    d: 'دروس مدعومة بشروحات نصية ومقاطع فيديو احترافية تناسب أسلوب تعلّمك.',
    color: '#F59E0B'
  },
  { 
    I: Users, 
    t: 'مجتمع طلابي', 
    d: 'تواصل مع زملائك وأساتذتك وتبادل المعرفة في بيئة تعليمية تعاونية.',
    color: '#EF4444'
  },
]

const steps = [
  { 
    n: 1, 
    t: 'أنشئ حسابك', 
    d: 'سجّل مجاناً في ثوانٍ وابدأ باستكشاف الدورات المتاحة.',
    icon: '01'
  },
  { 
    n: 2, 
    t: 'اختر دورتك', 
    d: 'تصفّح الدورات المتاحة في مختلف التخصصات وابدأ التعلم فوراً.',
    icon: '02'
  },
  { 
    n: 3, 
    t: 'احصل على شهادتك', 
    d: 'أنهِ الدورة بنجاح واحصل على شهادة إتمام رقمية معتمدة.',
    icon: '03'
  },
]

const stats = [
  { value: '+500', label: 'طالب نشط' },
  { value: '+50', label: 'دورة طبية' },
  { value: '98%', label: 'نسبة الرضا' },
]

export default function Home() {
  return (
    <div style={{background: 'var(--bg)'}}>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero" style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
        position: 'relative'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          top: '-10%',
          right: '-8%',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite'
        }}/>
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          bottom: '-5%',
          left: '-5%',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite reverse'
        }}/>
        
        {/* Floating Shapes */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.3)',
          animation: 'float 4s ease-in-out infinite',
          animationDelay: '0.5s'
        }}/>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.4)',
          animation: 'float 5s ease-in-out infinite',
          animationDelay: '1s'
        }}/>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '20%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.5)',
          animation: 'float 3s ease-in-out infinite',
          animationDelay: '1.5s'
        }}/>

        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          padding: '60px 20px'
        }}>
          <div style={{maxWidth: 800, margin: '0 auto', textAlign: 'center'}}>

            {/* Badge */}
            <div className="fade-up glass-dark" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              borderRadius: 99,
              marginBottom: 28,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Sparkles size={16} style={{color: '#FBBF24'}}/>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#F8FAFC',
                letterSpacing: '0.02em'
              }}>
                منصة التعليم الطبي العربي الأولى
              </span>
            </div>

            {/* Title */}
            <h1 className="fade-up stagger-1" style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: '-0.03em'
            }}>
              تعلّم الطب
              <br/>
              <span className="gradient-text" style={{
                background: 'linear-gradient(135deg, #818CF8, #C084FC, #22D3EE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                بأسلوب مختلف
              </span>
            </h1>

            {/* Subtitle */}
            <p className="fade-up stagger-2" style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: 560,
              margin: '0 auto 36px',
              lineHeight: 1.9,
              fontWeight: 400
            }}>
              منصة تعليمية طبية متخصصة تقدّم دورات في مختلف التخصصات الطبية 
              لطلاب الطب والمتخصصين الصحيين — بمحتوى علمي دقيق وأسلوب واضح.
            </p>

            {/* Buttons */}
            <div className="fade-up stagger-3" style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 40
            }}>
              <Link 
                href="/courses" 
                className="btn btn-primary btn-xl"
                style={{textDecoration: 'none', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'}}
              >
                <PlayCircle size={18}/>
                استعرض الدورات
              </Link>
              <Link 
                href="/auth/register" 
                className="btn btn-lg"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                سجّل مجاناً
                <ArrowLeft size={16}/>
              </Link>
            </div>

            {/* Stats */}
            <div className="fade-up stagger-4" style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '24px 32px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: 500,
              margin: '0 auto'
            }}>
              {stats.map(({value, label}, i) => (
                <div key={i} style={{textAlign: 'center'}}>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.02em'
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 500
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '120px 0',
        background: 'var(--bg)',
        position: 'relative'
      }}>
        {/* Background Decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}/>

        <div className="wrap-lg">
          {/* Header */}
          <div className="fade-up" style={{textAlign: 'center', marginBottom: 64}}>
            <div className="eyebrow">
              <Star size={14}/>
              ما تجده في المنصة
            </div>
            <h2 className="sec-title" style={{marginTop: 8}}>
              تعليم طبي بمنهج واضح
            </h2>
            <p className="sec-sub">
              صمّمنا المنصة لتمنح طالب الطب والمتخصص الصحي تجربة تعليمية 
              متكاملة وفعّالة مع أحدث الأساليب التعليمية
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24
          }}>
            {features.map(({I, t, d, color}, i) => (
              <div 
                key={i} 
                className="feature-card fade-up"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div 
                  className="icon-wrapper"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`
                  }}
                >
                  <I size={26} style={{color: color}}/>
                </div>
                <h3 style={{
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 10,
                  color: 'var(--tx1)'
                }}>
                  {t}
                </h3>
                <p style={{
                  fontSize: 15,
                  color: 'var(--tx3)',
                  lineHeight: 1.75
                }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          STEPS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '120px 0',
        background: 'var(--surface-2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none'
        }}/>

        <div className="wrap-lg">
          {/* Header */}
          <div className="fade-up" style={{textAlign: 'center', marginBottom: 80}}>
            <div className="eyebrow" style={{
              background: 'var(--accent-soft)',
              borderColor: 'var(--accent-mid)',
              color: 'var(--accent)'
            }}>
              <Target size={14}/>
              ابدأ رحلتك
            </div>
            <h2 className="sec-title">
              ثلاث خطوات فقط
            </h2>
          </div>

          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 40,
            maxWidth: 960,
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Connection Line */}
            <div style={{
              position: 'absolute',
              top: 40,
              left: '20%',
              right: '20%',
              height: 2,
              background: 'linear-gradient(90deg, var(--brand), var(--accent))',
              opacity: 0.2,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 40
            }}>
              <div style={{
                width: 80,
                height: 2,
                background: 'var(--brand)',
                transform: 'translateX(100%)'
              }}/>
              <div style={{
                width: 80,
                height: 2,
                background: 'var(--brand)',
                transform: 'translateX(-50%)'
              }}/>
            </div>

            {steps.map(({n, t, d, icon}, i) => (
              <div 
                key={i} 
                className="fade-up"
                style={{
                  textAlign: 'center',
                  animationDelay: `${i * 0.15}s`
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#fff',
                  boxShadow: 'var(--sh-brand)',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {icon}
                </div>
                <h3 style={{
                  fontWeight: 800,
                  fontSize: 20,
                  marginBottom: 12,
                  color: 'var(--tx1)'
                }}>
                  {t}
                </h3>
                <p style={{
                  fontSize: 15,
                  color: 'var(--tx3)',
                  lineHeight: 1.75,
                  maxWidth: 280,
                  margin: '0 auto'
                }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero" style={{
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          top: '-20%',
          right: '-10%',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          bottom: '-15%',
          left: '-5%',
          pointerEvents: 'none'
        }}/>

        <div className="wrap-sm" style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Badge */}
          <div className="fade-up glass-dark" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            borderRadius: 99,
            marginBottom: 28,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Heart size={16} style={{color: '#EF4444'}}/>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#F8FAFC'
            }}>
              انضم إلى أكثر من 500 طالب
            </span>
          </div>

          {/* Title */}
          <h2 className="fade-up stagger-1" style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-0.02em'
          }}>
            ابدأ التعلم الطبي
            <br/>
            <span style={{
              background: 'linear-gradient(135deg, #22D3EE, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              الآن مجاناً
            </span>
          </h2>

          {/* Description */}
          <p className="fade-up stagger-2" style={{
            color: 'rgba(255, 255, 255, 0.55)',
            fontSize: 18,
            margin: '0 auto 40px',
            lineHeight: 1.85,
            maxWidth: 480
          }}>
            سجّل حسابك مجاناً واستكشف الدورات الطبية المتاحة — 
            بدون أي التزامات أو رسوم خفية
          </p>

          {/* Buttons */}
          <div className="fade-up stagger-3" style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 40
          }}>
            <Link 
              href="/auth/register" 
              className="btn btn-primary btn-xl"
              style={{
                textDecoration: 'none',
                boxShadow: '0 8px 40px rgba(99, 102, 241, 0.5)'
              }}
            >
              <GraduationCap size={20}/>
              سجّل مجاناً الآن
            </Link>
            <Link 
              href="/courses" 
              className="btn btn-lg"
              style={{
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              استعرض الدورات
              <ChevronRight size={16}/>
            </Link>
          </div>

          {/* Features */}
          <div className="fade-up stagger-4" style={{
            display: 'flex',
            gap: 28,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: CheckCircle, text: 'تسجيل مجاني بالكامل' },
              { icon: Award, text: 'شهادات إتمام رقمية' },
              { icon: Clock, text: 'وصول 24/7' }
            ].map(({icon: Icon, text}, i) => (
              <span 
                key={i} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontWeight: 500
                }}
              >
                <Icon size={16} style={{color: '#22D3EE'}}/>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#0F172A',
        padding: '64px 20px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="wrap">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 48,
            marginBottom: 48
          }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 18,
                textDecoration: 'none'
              }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: 'var(--sh-brand)'
                }}>
                  <Stethoscope size={22}/>
                </div>
                <div style={{lineHeight: 1.2}}>
                  <span style={{
                    fontSize: 17,
                    fontWeight: 900,
                    color: '#fff',
                    display: 'block'
                  }}>
                    منصة تعلّم
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #818CF8, #22D3EE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}>
                    Medical Education
                  </span>
                </div>
              </Link>
              <p style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.4)',
                lineHeight: 1.8,
                maxWidth: 280
              }}>
                منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين — 
                محتوى علمي واضح ودقيق.
              </p>
            </div>

            {/* Links */}
            {[
              { 
                title: 'المنصة', 
                links: [
                  ['/', 'الرئيسية'],
                  ['/courses', 'الدورات'],
                  ['/auth/register', 'سجّل مجاناً'],
                  ['/auth/login', 'تسجيل الدخول']
                ]
              },
              { 
                title: 'المعلومات', 
                links: [
                  ['/terms', 'الشروط والأحكام'],
                  ['/privacy', 'سياسة الخصوصية'],
                  ['/contact', 'تواصل معنا']
                ]
              }
            ].map(({title, links}, i) => (
              <div key={i}>
                <h4 style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: 18,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  {title}
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  {links.map(([h, l]) => (
                    <Link 
                      key={h} 
                      href={h} 
                      style={{
                        fontSize: 14,
                        color: 'rgba(255, 255, 255, 0.4)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        width: 'fit-content'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center'
          }}>
            <p style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.3)'
            }}>
              © {new Date().getFullYear()} منصة تعلّم الطبية — جميع الحقوق محفوظة
            </p>
            <p style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.2)'
            }}>
              صُنع بـ 
              <Heart size={14} style={{display: 'inline', color: '#EF4444', margin: '0 4px'}}/>
              لخدمة الطب العربي
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
