import React from 'react'
import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle, Zap } from 'lucide-react'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
  progress?: number
}

export default function CourseCard({ course, showProgress, progress = 0 }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="block h-full">
      <div className="glass-card-hover h-full flex flex-col group overflow-hidden cursor-pointer">

        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden bg-surface-3">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{background:'var(--gradient-1)'}}>
              <PlayCircle className="w-14 h-14 text-white/60" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-bold flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4" /> عرض الدورة
            </span>
          </div>

          {/* Level badge */}
          <div className="absolute top-3 right-3">
            <span className="badge badge-primary shadow-sm text-xs backdrop-blur-sm">
              {getLevelLabel(course.level)}
            </span>
          </div>

          {/* Category badge */}
          {course.category?.name_ar && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-black/50 text-white backdrop-blur-sm text-[10px]">
                {course.category.name_ar}
              </span>
            </div>
          )}

          {/* Free badge */}
          {course.price === 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="badge badge-success shadow-sm">
                <Zap className="w-3 h-3" /> مجاني
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-black text-base mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors text-secondary">
            {course.title}
          </h3>

          {course.short_description && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3 flex-1 leading-relaxed">
              {course.short_description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-text-muted mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary/60" />
              <span>{Math.round(course.duration_hours)}س</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-primary/60" />
              <span>{course.total_lessons} درس</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary/60" />
              <span>{course.total_students?.toLocaleString()}</span>
            </div>
          </div>

          {/* Rating & Price */}
          {!showProgress && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-black text-secondary">{course.avg_rating || 'جديد'}</span>
                {course.total_reviews > 0 && (
                  <span className="text-xs text-text-muted">({course.total_reviews})</span>
                )}
              </div>
              <div className="text-left">
                {course.original_price && course.original_price > course.price && (
                  <span className="text-xs text-text-muted line-through ml-1">
                    {formatPrice(course.original_price, course.currency)}
                  </span>
                )}
                <span className={`font-black text-lg ${course.price === 0 ? 'text-emerald-500' : 'text-primary'}`}>
                  {formatPrice(course.price, course.currency)}
                </span>
              </div>
            </div>
          )}

          {/* Progress */}
          {showProgress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-text-secondary font-medium">التقدم</span>
                <span className="font-black text-primary">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
