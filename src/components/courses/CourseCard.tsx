import Link from 'next/link'
import { Course } from '@/types'
import { formatPrice, getLevelLabel } from '@/lib/utils'
import { Star, Clock, BookOpen, Users, PlayCircle, Award } from 'lucide-react'

interface Props { course:Course; showProgress?:boolean; progress?:number }

export default function CourseCard({ course, showProgress, progress=0 }: Props) {
  return (
    <Link href={`/courses/${course.slug}`} style={{textDecoration:'none',display:'block',height:'100%'}}>
      <div className="card card-hover" style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden',cursor:'pointer'}}>

        {/* thumbnail */}
        <div style={{position:'relative',height:186,overflow:'hidden',background:'var(--bg3)',flexShrink:0}}>
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title}
              style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .45s ease'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='none')}/>
          ) : (
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#042a30,#0a4a50)'}}>
              <PlayCircle size={44} style={{color:'rgba(94,234,212,.35)'}}/>
            </div>
          )}
          {/* gradient overlay */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(4,42,48,.5),transparent 50%)'}}/>

          <div style={{position:'absolute',top:10,right:10}}>
            <span className="badge badge-teal" style={{fontSize:10,backdropFilter:'blur(8px)'}}>{getLevelLabel(course.level)}</span>
          </div>
          {course.price===0 && (
            <div style={{position:'absolute',top:10,left:10}}>
              <span className="badge badge-green" style={{fontSize:10}}><Award size={9}/>مجاني</span>
            </div>
          )}
          {course.category?.name_ar && (
            <div style={{position:'absolute',bottom:10,right:10}}>
              <span style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:99,background:'rgba(4,42,48,.7)',color:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)'}}>{course.category.name_ar}</span>
            </div>
          )}
        </div>

        {/* body */}
        <div style={{padding:'16px',flex:1,display:'flex',flexDirection:'column'}}>
          <h3 style={{fontWeight:800,fontSize:14.5,lineHeight:1.45,marginBottom:6,color:'var(--txt1)',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {course.title}
          </h3>
          {course.short_description && (
            <p style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.6,marginBottom:10,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
              {course.short_description}
            </p>
          )}
          <div style={{display:'flex',gap:12,fontSize:11.5,color:'var(--txt3)',marginTop:'auto',paddingTop:10,borderTop:'1px solid var(--border)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={11}/>{Math.round(course.duration_hours)}س</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><BookOpen size={11}/>{course.total_lessons} درس</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Users size={11}/>{(course.total_students||0).toLocaleString()}</span>
          </div>
          {!showProgress && (
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                <Star size={13} style={{fill:'#f59e0b',color:'#f59e0b'}}/>
                <span style={{fontSize:13,fontWeight:800,color:'var(--txt1)'}}>{course.avg_rating||'جديد'}</span>
                {course.total_reviews>0&&<span style={{fontSize:11,color:'var(--txt3)'}}>({course.total_reviews})</span>}
              </div>
              <span style={{fontWeight:900,fontSize:16,color:course.price===0?'var(--ok)':'var(--teal)'}}>{formatPrice(course.price,course.currency)}</span>
            </div>
          )}
          {showProgress && (
            <div style={{marginTop:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5}}>
                <span style={{color:'var(--txt2)'}}>التقدم</span>
                <span style={{fontWeight:800,color:'var(--teal)'}}>{progress}%</span>
              </div>
              <div className="prog"><div className="prog-fill" style={{width:`${progress}%`}}/></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
