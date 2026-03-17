import React from 'react'
import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle } from 'lucide-react'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
  progress?: number
}

export default function CourseCard({ course, showProgress, progress = 0 }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <div className="glass-card-hover h-full flex flex-col group cursor-pointer overflow-hidden">

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-surface-3" style={{background:'var(--navy)'}}>
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{background:'var(--gradient-dark)'}}>
              <PlayCircle className="w-12 h-12 opacity-30" style={{color:'var(--gold)'}} />
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Level */}
          <div className="absolute top-3 right-3">
            <span className="badge badge-gold text-[10px]">{getLevelLabel(course.level)}</span>
          </div>

          {/* Category */}
          {course.category?.name_ar && (
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{background:'rgba(0,0,0,0.55)', color:'rgba(255,255,255,0.85)'}}>
                {course.category.name_ar}
              </span>
            </div>
          )}

          {/* Free */}
          {course.price === 0 && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-success text-[10px]">مجاني</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">

          <h3 className="font-black text-base mb-2 line-clamp-2 leading-snug transition-colors duration-200"
            style={{color:'var(--primary)'}}
            onMouseEnter={e => (e.currentTarget.style.color='var(--gold-dark)')}
            onMouseLeave={e => (e.currentTarget.style.color='var(--primary)')}>
            {course.title}
          </h3>

          {course.short_description && (
            <p className="text-xs line-clamp-2 mb-4 flex-1 leading-relaxed" style={{color:'var(--text-secondary)'}}>
              {course.short_description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs pt-4 border-t" style={{borderColor:'var(--border)', color:'var(--text-muted)'}}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round(course.duration_hours)}س</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.total_lessons} درس</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{course.total_students?.toLocaleString()}</span>
            </div>
          </div>

          {/* Rating & Price */}
          {!showProgress && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{borderColor:'var(--border)'}}>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" style={{color:'var(--gold)'}} />
                <span className="text-sm font-black" style={{color:'var(--text-primary)'}}>{course.avg_rating || 'جديد'}</span>
                {course.total_reviews > 0 && (
                  <span className="text-xs" style={{color:'var(--text-muted)'}}>({course.total_reviews})</span>
                )}
              </div>
              <div>
                {course.original_price && course.original_price > course.price && (
                  <span className="text-xs line-through ml-1.5" style={{color:'var(--text-muted)'}}>
                    {formatPrice(course.original_price, course.currency)}
                  </span>
                )}
                <span className="font-black text-lg" style={{color: course.price===0 ? '#059669' : 'var(--gold-dark)'}}>
                  {formatPrice(course.price, course.currency)}
                </span>
              </div>
            </div>
          )}

          {showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span style={{color:'var(--text-secondary)'}}>التقدم</span>
                <span className="font-black" style={{color:'var(--gold-dark)'}}>{progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
