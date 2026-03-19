import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle } from 'lucide-react'

interface Props { course:Course; showProgress?:boolean; progress?:number }

import { cn } from '@/lib/utils'

interface Props { course:Course; showProgress?:boolean; progress?:number }

export default function CourseCard({ course, showProgress, progress=0 }: Props) {
  return (
    <Link href={`/courses/${course.slug}`} className="block h-full group">
      <div className="card card-hover h-full flex flex-col overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-bg3 flex-shrink-0">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy">
              <PlayCircle size={48} className="text-white/20" />
            </div>
          )}
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-navy/80 backdrop-blur-md text-[10px] font-bold text-mint border border-white/10 shadow-lg">
              {getLevelLabel(course.level)}
            </span>
            {course.price === 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-ok/90 backdrop-blur-md text-[10px] font-bold text-white shadow-lg">
                مجاني
              </span>
            )}
          </div>

          {course.category?.name_ar && (
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
                {course.category.name_ar}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-sm md:text-base font-black text-navy leading-snug mb-3 line-clamp-2 transition-colors group-hover:text-navy2">
            {course.title}
          </h3>
          
          {course.short_description && (
            <p className="text-xs text-txt2 leading-relaxed mb-4 line-clamp-2 opacity-80">
              {course.short_description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-[11px] font-bold text-txt3">
               <div className="flex items-center gap-1.5"><Clock size={12}/>{Math.round(course.duration_hours)}س</div>
               <div className="flex items-center gap-1.5"><BookOpen size={12}/>{course.total_lessons}</div>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-bold text-txt3">
               <Users size={12}/>
               <span>{(course.total_students||0).toLocaleString()}</span>
            </div>
          </div>

          {!showProgress ? (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Star size={12} className="fill-gold text-gold" />
                  <span className="text-xs font-black text-navy">{course.avg_rating || '5.0'}</span>
                </div>
                {course.total_reviews > 0 && (
                  <span className="text-[10px] font-bold text-txt3">({course.total_reviews})</span>
                )}
              </div>
              <span className={cn(
                'text-sm font-black tracking-tight',
                course.price === 0 ? 'text-ok' : 'text-navy'
              )}>
                {formatPrice(course.price, course.currency)}
              </span>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-txt2 uppercase tracking-wider">التقدم</span>
                <span className="text-[10px] font-black text-navy">{progress}%</span>
              </div>
              <div className="prog h-1.5">
                <div className="prog-fill bg-mint" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

