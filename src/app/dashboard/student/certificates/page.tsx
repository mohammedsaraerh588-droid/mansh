'use client'
import { useEffect, useState } from 'react'
import { Award, Download, ExternalLink, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function StudentCertificatesPage() {
  const [certs,   setCerts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/certificate').then(r => r.json()).then(d => {
      setCerts(d.certificates || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={28} className="spin" style={{color:'var(--alpha-green)'}}/>
    </div>
  )

  return (
    <div style={{display:'flex', flexDirection:'column', gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>الطالب</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>شهاداتي</h1>
        <p style={{fontSize:14,color:'var(--tx3)',marginTop:3}}>تُصدر تلقائياً عند إتمام أي دورة بنسبة 100%</p>
      </div>

      {certs.length === 0 ? (
        <div className="card" style={{padding:64,textAlign:'center'}}>
          <div style={{width:60,height:60,borderRadius:16,background:'#E8F5E9',border:'1px solid var(--alpha-green-m)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <Award size={26} style={{color:'var(--alpha-green)'}}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:700,marginBottom:8,color:'var(--tx1)'}}>لا توجد شهادات بعد</h3>
          <p style={{fontSize:14,color:'var(--tx3)',marginBottom:20}}>أتمم أي دورة بنسبة 100% لتحصل على شهادتك تلقائياً.</p>
          <Link href="/courses" className="btn-register" style={{textDecoration:'none',display:'inline-flex'}}>
            <BookOpen size={15}/>تصفّح الدورات
          </Link>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:18}}>
          {certs.map((cert:any) => (
            <div key={cert.id} className="card" style={{overflow:'hidden'}}>
              <div style={{height:110,background:'linear-gradient(135deg,#1B5E20,#2E7D32)',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% -20%,rgba(76,175,80,.3) 0%,transparent 60%)'}}/>
                <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                  <Award size={32} style={{color:'#A5D6A7',marginBottom:4}}/>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',color:'rgba(255,255,255,.6)',textTransform:'uppercase'}}>شهادة إتمام</div>
                </div>
                <div style={{position:'absolute',top:8,right:8,width:16,height:16,borderTop:'2px solid rgba(255,255,255,.3)',borderRight:'2px solid rgba(255,255,255,.3)'}}/>
                <div style={{position:'absolute',top:8,left:8,width:16,height:16,borderTop:'2px solid rgba(255,255,255,.3)',borderLeft:'2px solid rgba(255,255,255,.3)'}}/>
                <div style={{position:'absolute',bottom:8,right:8,width:16,height:16,borderBottom:'2px solid rgba(255,255,255,.3)',borderRight:'2px solid rgba(255,255,255,.3)'}}/>
                <div style={{position:'absolute',bottom:8,left:8,width:16,height:16,borderBottom:'2px solid rgba(255,255,255,.3)',borderLeft:'2px solid rgba(255,255,255,.3)'}}/>
              </div>
              <div style={{padding:'16px 18px'}}>
                <div style={{fontWeight:800,fontSize:14,color:'var(--tx1)',marginBottom:4}}>{cert.course_title}</div>
                <div style={{fontSize:12,color:'var(--tx3)',marginBottom:14}}>
                  {new Date(cert.issued_at).toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'})}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid var(--brd)'}}>
                  <span style={{fontSize:10,color:'var(--tx4)',fontFamily:'monospace'}}>{cert.certificate_number}</span>
                  <div style={{display:'flex',gap:7}}>
                    <a href={`/api/certificate/pdf?certId=${cert.id}`} target="_blank" rel="noopener"
                      className="btn btn-outline btn-sm" style={{textDecoration:'none'}}>
                      <ExternalLink size={11}/>معاينة
                    </a>
                    <a href={`/api/certificate/pdf?certId=${cert.id}`} target="_blank" rel="noopener"
                      className="btn-register btn-sm" style={{textDecoration:'none',padding:'6px 12px',borderRadius:8,fontSize:12}}>
                      <Download size={11}/>تحميل
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
