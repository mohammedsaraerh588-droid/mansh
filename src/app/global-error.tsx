'use client'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{margin:0,fontFamily:'Tajawal,sans-serif',background:'#F5F6FA',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',textAlign:'center',padding:'24px'}}>
        <div>
          <div style={{width:70,height:70,borderRadius:'50%',background:'#FFFBEB',border:'2px solid #FDE68A',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <AlertTriangle size={34} color="#D97706"/>
          </div>
          <h1 style={{fontSize:26,fontWeight:900,color:'#1A1A2E',marginBottom:10}}>حدث خطأ غير متوقع</h1>
          <p style={{fontSize:15,color:'#6B7280',marginBottom:24,lineHeight:1.8}}>نعتذر عن هذا الخلل المؤقت. حاول تحديث الصفحة.</p>
          <button onClick={reset}
            style={{padding:'11px 28px',borderRadius:10,border:'none',background:'#4CAF50',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>
            تحديث الصفحة
          </button>
        </div>
      </body>
    </html>
  )
}
