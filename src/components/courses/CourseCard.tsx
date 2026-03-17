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
    <Link href={`/courses/${course.slug}`}>
      <div className="glass-card-hover h-full flex flex-col group overflow-hidden cursor-pointer bg-white">
        {/* Thumbnail */}
        <div className="relative h-48 w-full bg-surface-3 overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3 text-text-muted">
              <PlayCircle className="w-12 h-12 opacity-50" />
            </div>
          )}
          
          {/* Level Badge */}
          <div className="absolute top-3 right-3">
            <span className="badge badge-primary shadow-sm bg-white/90 backdrop-blur-md border border-border">
              {getLevelLabel(course.level)}
            </span>
          </div>
          
          {/* Tag / Category */}
          {course.category?.name_ar && (
            <div className="absolute bottom-3 right-3">
              <span className="badge bg-white/90 text-text-primary backdrop-blur-md border border-border text-[10px] px-2 shadow-sm font-semibold">
                {course.category.name_ar}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors text-secondary">
            {course.title}
          </h3>
          
          {course.short_description && (
            <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
              {course.short_description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-text-muted mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round(course.duration_hours)} س</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.total_lessons} درس</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{course.total_students}</span>
            </div>
          </div>

          {/* Rating and Price row */}
          {!showProgress && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-sm font-semibold">{course.avg_rating || 'جديد'}</span>
                {course.total_reviews > 0 && (
                  <span className="text-xs text-text-muted">({course.total_reviews})</span>
                )}
              </div>
              <div className="text-left">
                {course.original_price && course.original_price > course.price && (
                  <span className="text-xs text-text-muted line-through ml-2">
                    {formatPrice(course.original_price, course.currency)}
                  </span>
                )}
                <span className="font-bold text-primary text-lg">
                  {formatPrice(course.price, course.currency)}
                </span>
              </div>
            </div>
          )}

          {/* Progress Bar (if enrolled) */}
          {showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">نسبة الإنجاز</span>
                <span className="font-bold text-primary">{progress}%</span>
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
