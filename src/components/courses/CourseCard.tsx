import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle, Zap } from 'lucide-react'

interface Props { course:Course; showProgress?:boolean; progress?:number }

export default function CourseCard({ course, showProgress, progress=0 }: Props) {
  return (
    <Link href={`/courses/${course.slug}`} style={{textDecoration:'none',display:'block',height:'100%'}}>
      <div className="card card-hover" style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>

        {/* Thumbnail */}
        <div style={{position:'relative',height:186,overflow:'hidden',background:'var(--c-bg3)',flexShrink:0}}>
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title}
              style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .5s ease'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.06)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='none')}/>
          ) : (
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1e0a3c,#2d1065)'}}>
              <PlayCircle size={46} style={{color:'rgba(139,92,246,.4)'}}/>
            </div>
          )}
          {/* overlay on hover */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(15,7,30,.7),transparent)',opacity:0,transition:'opacity .3s'}}
            onMouseEnter={e=>(e.currentTarget.style.opacity='1')}
            onMouseLeave={e=>(e.currentTarget.style.opacity='0')}>
            <div style={{position:'absolute',bottom:12,right:12,display:'flex',alignItems:'center',gap:6,color:'#fff',fontSize:13,fontWeight:700}}>
              <PlayCircle size={15}/>عرض الدورة
            </div>
          </div>
          {/* badges */}
          <div style={{position:'absolute',top:10,right:10}}>
            <span className="badge badge-purple" style={{fontSize:10,backdropFilter:'blur(8px)',background:'rgba(109,40,217,.85)'}}>{getLevelLabel(course.level)}</span>
          </div>
          {course.price===0 && <div style={{position:'absolute',top:10,left:10}}>
            <span className="badge badge-green" style={{fontSize:10,backdropFilter:'blur(8px)'}}><Zap size={9}/>مجاني</span>
          </div>}
          {course.category?.name_ar && <div style={{position:'absolute',bottom:10,right:10}}>
            <span style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:99,background:'rgba(0,0,0,.55)',color:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)'}}>{course.category.name_ar}</span>
          </div>}
        </div>

        {/* Content */}
        <div style={{padding:'16px',flex:1,display:'flex',flexDirection:'column'}}>
          <h3 style={{fontWeight:800,fontSize:15,lineHeight:1.4,marginBottom:6,color:'var(--c-txt1)',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {course.title}
          </h3>
          {course.short_description && (
            <p style={{fontSize:12.5,color:'var(--c-txt2)',lineHeight:1.6,marginBottom:10,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
              {course.short_description}
            </p>
          )}
          <div style={{display:'flex',gap:12,fontSize:12,color:'var(--c-txt3)',marginTop:'auto',paddingTop:10,borderTop:'1px solid var(--c-border)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={12}/>{Math.round(course.duration_hours)}س</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><BookOpen size={12}/>{course.total_lessons} درس</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Users size={12}/>{(course.total_students||0).toLocaleString()}</span>
          </div>

          {!showProgress && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:12,borderTop:'1px solid var(--c-border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:4,fontSize:13}}>
                <Star size={13} style={{fill:'#f59e0b',color:'#f59e0b'}}/>
                <span style={{fontWeight:800,color:'var(--c-txt1)'}}>{course.avg_rating||'جديد'}</span>
                {course.total_reviews>0 && <span style={{color:'var(--c-txt3)'}}>({course.total_reviews})</span>}
              </div>
              <span style={{fontWeight:900,fontSize:16,color: course.price===0?'var(--c-ok)':'var(--c-p)'}}>{formatPrice(course.price,course.currency)}</span>
            </div>
          )}
          {showProgress && (
            <div style={{marginTop:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5,color:'var(--c-txt2)'}}>
                <span>التقدم</span><span style={{fontWeight:800,color:'var(--c-p)'}}>{progress}%</span>
              </div>
              <div className="prog"><div className="prog-fill" style={{width:`${progress}%`}}/></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
