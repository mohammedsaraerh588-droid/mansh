import Link from 'next/link'
import { BookOpen, Clock, Users } from 'lucide-react'
import { formatPrice, formatDuration, getLevelLabel } from '@/lib/utils'
import Image from 'next/image'

interface Props { course: any }

const LEVEL_COLORS: Record<string,string> = {
  beginner:     '#E8F5E9',
  intermediate: '#FFF8E1',
  advanced:     '#FCE4EC',
}
const LEVEL_TC: Record<string,string> = {
  beginner:     '#2E7D32',
  intermediate: '#F57F17',
  advanced:     '#C62828',
}

export default function CourseCard({ course }: Props) {
  const level = course.level || 'beginner'
  const price = course.price ?? 0
  const free  = price === 0

  return (
    <Link href={`/courses/${course.slug}`} style={{textDecoration:'none',display:'block'}}>
      <div className="card" style={{overflow:'hidden',height:'100%',display:'flex',flexDirection:'column',transition:'all .2s'}}
        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='translateY(-3px)';el.style.borderColor='var(--alpha-green-m)';el.style.boxShadow='var(--sh3)'}}
        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='none';el.style.borderColor='var(--brd)';el.style.boxShadow='var(--sh1)'}}>

        {/* Thumbnail */}
        <div style={{height:165,position:'relative',overflow:'hidden',flexShrink:0,
          background:course.thumbnail_url?undefined:'linear-gradient(135deg,#1B5E20,#388E3C)'}}>
          {course.thumbnail_url
            ? <Image src={course.thumbnail_url} alt={course.title} fill style={{objectFit:'cover',transition:'transform .3s'}}/>
            : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:44,opacity:.4}}>📚</div>}

          {/* Badges overlay */}
          <div style={{position:'absolute',top:10,right:10,display:'flex',gap:5,flexWrap:'wrap'}}>
            {free && <span style={{background:'var(--alpha-green)',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:6,boxShadow:'0 2px 6px rgba(0,0,0,.2)'}}>مجاني</span>}
            <span style={{background:LEVEL_COLORS[level]||'#E8F5E9',color:LEVEL_TC[level]||'#2E7D32',fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:6}}>
              {getLevelLabel(level)}
            </span>
          </div>

          {/* Category */}
          {course.category?.name_ar && (
            <div style={{position:'absolute',bottom:8,right:10}}>
              <span style={{background:'rgba(0,0,0,.55)',color:'rgba(255,255,255,.9)',fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:5,backdropFilter:'blur(4px)'}}>
                {course.category.name_ar}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:6,flex:1}}>
          <h3 style={{fontSize:14.5,fontWeight:700,color:'var(--tx1)',lineHeight:1.45,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {course.title}
          </h3>

          {/* Teacher */}
          {course.teacher?.full_name && (
            <p style={{fontSize:12,color:'var(--tx3)',margin:0}}>{course.teacher.full_name}</p>
          )}

          {/* Rating */}
          {(course.avg_rating > 0 || course.total_reviews > 0) && (
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12}}>
              <span style={{color:'#F59E0B',fontWeight:700}}>{course.avg_rating?.toFixed(1)||'0.0'}</span>
              <span style={{color:'#F59E0B'}}>{'★'.repeat(Math.round(course.avg_rating||0))}{'☆'.repeat(5-Math.round(course.avg_rating||0))}</span>
              {course.total_reviews > 0 && <span style={{color:'var(--tx4)'}}>({course.total_reviews})</span>}
            </div>
          )}

          {/* Stats */}
          <div style={{display:'flex',alignItems:'center',gap:12,fontSize:11.5,color:'var(--tx3)',marginTop:'auto',paddingTop:8,borderTop:'1px solid var(--brd)'}}>
            {course.total_lessons > 0 && (
              <span style={{display:'flex',alignItems:'center',gap:3}}><BookOpen size={11}/>{course.total_lessons} درس</span>
            )}
            {course.duration_hours > 0 && (
              <span style={{display:'flex',alignItems:'center',gap:3}}><Clock size={11}/>{formatDuration(course.duration_hours)}</span>
            )}
            {course.total_students > 0 && (
              <span style={{display:'flex',alignItems:'center',gap:3}}><Users size={11}/>{course.total_students}</span>
            )}
            <span style={{marginRight:'auto',fontSize:15,fontWeight:900,color:free?'var(--alpha-green)':'var(--tx1)'}}>
              {free ? 'مجاني' : formatPrice(price, course.currency)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
