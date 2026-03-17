'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Award, Download, ExternalLink, Loader2 } from 'lucide-react'

export default function StudentCertificates() {
  const [certs,   setCerts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('certificates')
        .select('id,issued_at,verification_code,certificate_url,courses(title)')
        .eq('student_id',session.user.id).order('issued_at',{ascending:false})
      setCerts(data||[]); setLoading(false)
    })()
  },[])

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>مكتسباتي</p>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4}}>الشهادات</h1>
        <p style={{fontSize:14,color:'var(--txt2)'}}>سجل جميع دوراتك المكتملة وشهاداتك المعتمدة.</p>
      </div>

      {certs.length===0 ? (
        <div className="card" style={{padding:56,textAlign:'center'}}>
          <div style={{width:64,height:64,borderRadius:18,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <Award size={28} style={{color:'var(--txt3)'}}/>
          </div>
          <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:'var(--txt1)'}}>لم تحصل على أي شهادة بعد</h3>
          <p style={{fontSize:14,color:'var(--txt2)',marginBottom:22}}>أكمل دوراتك بنسبة 100% للحصول على شهادات معتمدة.</p>
          <Link href="/dashboard/student/courses" className="btn btn-gold btn-md" style={{textDecoration:'none',display:'inline-flex'}}>متابعة التعلم</Link>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
          {certs.map(cert=>(
            <div key={cert.id} className="card" style={{padding:24,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'linear-gradient(90deg,var(--gold),var(--gold3))'}}/>
              <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#faf6ec,#f5edd8)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14,border:'1px solid rgba(160,120,40,.2)'}}>
                <Award size={24} style={{color:'var(--gold)'}}/>
              </div>
              <h3 style={{fontWeight:800,fontSize:15,marginBottom:6,color:'var(--txt1)'}}>{cert.courses?.title}</h3>
              <p style={{fontSize:12,color:'var(--txt3)',marginBottom:12}}>
                {new Date(cert.issued_at).toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'})}
              </p>
              <div style={{fontSize:11,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:8,padding:'6px 12px',marginBottom:16,wordBreak:'break-all',color:'var(--txt3)',width:'100%'}}>
                رمز التحقق: <span style={{fontWeight:700,color:'var(--gold)',fontSize:12}}>{cert.verification_code}</span>
              </div>
              <div style={{display:'flex',gap:8,width:'100%'}}>
                <button className="btn btn-outline btn-sm" style={{flex:1}} disabled={!cert.certificate_url}>
                  <Download size={13}/>تحميل
                </button>
                <button className="btn btn-ghost btn-sm" style={{flex:1,background:'var(--bg2)'}}>
                  <ExternalLink size={13}/>مشاركة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
