import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle, Award, CheckCircle } from 'lucide-react'

interface Props { 
  course: Course
  showProgress?: boolean
  progress?: number 
}

export default function CourseCard({ course, showProgress, progress = 0 }: Props) {
  return (
    <Link href={`/courses/${course.slug}`} style={{textDecoration: 'none', display: 'block', height: '100%'}}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--surface)',
        border: '1px solid var(--brd)',
        borderRadius: 24,
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--sh2)'
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sh-brand)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-mid)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sh2)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--brd)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}>

        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          height: 200,
          overflow: 'hidden',
          background: 'var(--surface-2)',
          flexShrink: 0
        }}>
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative circles */}
              <div style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                top: -30,
                right: -30
              }}/>
              <div style={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                bottom: -20,
                left: -20
              }}/>
              <PlayCircle size={52} style={{color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 1}}/>
            </div>
          )}

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 50%)'
          }}/>

          {/* Top Badges */}
          <div style={{position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 800,
              background: 'rgba(99, 102, 241, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}>
              {getLevelLabel(course.level)}
            </span>
          </div>

          {/* Free Badge */}
          {course.price === 0 && (
            <div style={{position: 'absolute', top: 12, left: 12}}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 800,
                background: 'rgba(16, 185, 129, 0.95)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <Award size={12}/>
                مجاني
              </span>
            </div>
          )}

          {/* Category */}
          {course.category?.name_ar && (
            <div style={{position: 'absolute', bottom: 12, right: 12}}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 99,
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                {course.category.name_ar}
              </span>
            </div>
          )}

          {/* Play Button Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transform: 'scale(0.8)',
              transition: 'transform 0.3s ease'
            }}>
              <PlayCircle size={32} style={{color: 'var(--brand)', marginRight: -3}}/>
            </div>
          </div>
        </div>


        {/* Body */}
        <div style={{
          padding: '20px 20px 20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            fontWeight: 800,
            fontSize: 16,
            lineHeight: 1.5,
            marginBottom: 8,
            color: 'var(--tx1)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {course.title}
          </h3>

          {course.short_description && (
            <p style={{
              fontSize: 13.5,
              color: 'var(--tx3)',
              lineHeight: 1.7,
              marginBottom: 12,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {course.short_description}
            </p>
          )}

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: 16,
            fontSize: 12,
            color: 'var(--tx3)',
            marginTop: 'auto',
            paddingTop: 14,
            borderTop: '1px solid var(--brd)'
          }}>
            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
              <Clock size={13} style={{color: 'var(--brand)'}}/>
              {Math.round(course.duration_hours)} ساعة
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
              <BookOpen size={13} style={{color: 'var(--accent)'}}/>
              {course.total_lessons} درس
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
              <Users size={13} style={{color: 'var(--purple)'}}/>
              {(course.total_students || 0).toLocaleString()}
            </span>
          </div>

          {/* Progress or Price */}
          {!showProgress && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid var(--brd)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <Star size={15} style={{fill: '#FBBF24', color: '#FBBF24'}}/>
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'var(--tx1)'
                }}>
                  {course.avg_rating || 'جديد'}
                </span>
                {course.total_reviews > 0 && (
                  <span style={{fontSize: 12, color: 'var(--tx4)'}}>
                    ({course.total_reviews})
                  </span>
                )}
              </div>

              <span style={{
                fontWeight: 900,
                fontSize: 18,
                color: course.price === 0 ? 'var(--ok)' : 'var(--brand)'
              }}>
                {course.price === 0 ? (
                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}>
                    <CheckCircle size={16}/>
                    مجاني
                  </span>
                ) : (
                  formatPrice(course.price, course.currency)
                )}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && (
            <div style={{marginTop: 16}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginBottom: 8
              }}>
                <span style={{color: 'var(--tx2)', fontWeight: 600}}>التقدم</span>
                <span style={{fontWeight: 800, color: 'var(--brand)'}}>{progress}%</span>
              </div>
              <div className="prog">
                <div 
                  className="prog-fill" 
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
