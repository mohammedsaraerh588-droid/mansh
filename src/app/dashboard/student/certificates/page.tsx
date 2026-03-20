'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Award, Download, ExternalLink, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function StudentCertificatesPage() {
  const [certs,   setCerts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/certificate')
      const { certificates } = await res.json()
      setCerts(certificates || [])
      setLoading(false)
    })()
  }, [])

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
      <Loader2 size={28} className="spin" style={{color:'var(--brand)'}}/>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--brand)',marginBottom:5}}>الإنجازات</p>
        <h1 style={{fontSize:24,fontWeight:800,color:'var(--tx1)',letterSpacing:'-.02em'}}>شهاداتي</h1>
        <p style={{fontSize:14,color:'var(--tx3)',marginTop:3}}>شهاداتك تُصدر تلقائياً عند إتمام أي دورة بنسبة 100%</p>
      </div>

      {certs.length === 0 ? (
        <div className="card" style={{padding:64,textAlign:'center'}}>
          <div style={{width:64,height:64,borderRadius:16,background:'var(--brand-light)',border:'1px solid var(--brand-mid)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <Award size={28} style={{color:'var(--brand)'}}/>
          </div>
          <h3 style={{fontSize:17,fontWeight:700,marginBottom:8,color:'var(--tx1)'}}>لا توجد شهادات بعد</h3>
          <p style={{fontSize:14,color:'var(--tx3)',marginBottom:20}}>أتمم أي دورة بنسبة 100% لتحصل على شهادتك تلقائياً.</p>
          <Link href="/courses" className="btn btn-primary btn-md" style={{textDecoration:'none',display:'inline-flex'}}>
            <BookOpen size={15}/>تصفح الدورات
          </Link>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:20}}>
          {certs.map((cert:any) => (
            <div key={cert.id} className="card" style={{overflow:'hidden',transition:'all .2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-3px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--sh3)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.boxShadow='var(--sh1)'}}>
              {/* Certificate preview header */}
              <div style={{height:120,background:'linear-gradient(135deg,#060608,#1a1040)',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% -20%,rgba(99,91,255,.35) 0%,transparent 60%)'}}/>
                <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                  <Award size={36} style={{color:'#A5B4FC',marginBottom:6}}/>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:'.15em',color:'rgba(255,255,255,.5)',textTransform:'uppercase'}}>شهادة إتمام</div>
                </div>
                {/* corner decorations */}
                <div style={{position:'absolute',top:8,right:8,width:20,height:20,borderTop:'2px solid rgba(99,91,255,.4)',borderRight:'2px solid rgba(99,91,255,.4)'}}/>
                <div style={{position:'absolute',top:8,left:8,width:20,height:20,borderTop:'2px solid rgba(99,91,255,.4)',borderLeft:'2px solid rgba(99,91,255,.4)'}}/>
                <div style={{position:'absolute',bottom:8,right:8,width:20,height:20,borderBottom:'2px solid rgba(99,91,255,.4)',borderRight:'2px solid rgba(99,91,255,.4)'}}/>
                <div style={{position:'absolute',bottom:8,left:8,width:20,height:20,borderBottom:'2px solid rgba(99,91,255,.4)',borderLeft:'2px solid rgba(99,91,255,.4)'}}/>
              </div>

              <div style={{padding:'18px 20px'}}>
                <div style={{fontWeight:800,fontSize:15,color:'var(--tx1)',marginBottom:4,letterSpacing:'-.01em'}}>{cert.course_title}</div>
                <div style={{fontSize:13,color:'var(--tx3)',marginBottom:14}}>
                  {new Date(cert.issued_at).toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'})}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid var(--brd)'}}>
                  <span style={{fontSize:11,color:'var(--tx4)',fontFamily:'monospace',letterSpacing:'.05em'}}>{cert.certificate_number}</span>
                  <div style={{display:'flex',gap:8}}>
                    <a href={`/api/certificate/pdf?certId=${cert.id}`} target="_blank" rel="noopener"
                      className="btn btn-outline btn-sm" style={{textDecoration:'none'}}>
                      <ExternalLink size={12}/>معاينة
                    </a>
                    <a href={`/api/certificate/pdf?certId=${cert.id}`} target="_blank" rel="noopener"
                      className="btn btn-primary btn-sm" style={{textDecoration:'none'}}>
                      <Download size={12}/>تحميل
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
