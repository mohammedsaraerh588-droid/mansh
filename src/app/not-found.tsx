'use client'
import Link from 'next/link'
import { Stethoscope, Home, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:'40px 20px'}}>
      <div style={{textAlign:'center',maxWidth:480}}>
        {/* Icon */}
        <div style={{width:80,height:80,borderRadius:20,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
          <Stethoscope size={36} style={{color:'var(--teal)'}}/>
        </div>
        {/* 404 */}
        <div style={{fontSize:80,fontWeight:900,lineHeight:1,background:'linear-gradient(135deg,var(--teal),var(--teal2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:12}}>
          404
        </div>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:8}}>الصفحة غير موجودة</h1>
        <p style={{fontSize:15,color:'var(--txt2)',marginBottom:32,lineHeight:1.75}}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/" className="btn btn-primary btn-lg" style={{textDecoration:'none'}}>
            <Home size={16}/>الصفحة الرئيسية
          </Link>
          <Link href="/courses" className="btn btn-outline btn-lg" style={{textDecoration:'none'}}>
            <BookOpen size={16}/>تصفّح الدورات
          </Link>
        </div>
      </div>
    </div>
  )
}
