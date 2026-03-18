'use client'
import { useState } from 'react'
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function ContactPage() {
  const [form,    setForm]    = useState({ name:'', email:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [err,     setErr]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr(''); setSuccess(false)
    try {
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (!res.ok) throw new Error('فشل الإرسال')
      setSuccess(true); setForm({ name:'', email:'', subject:'', message:'' })
      setTimeout(()=>setSuccess(false), 5000)
    } catch { setErr('حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      {/* Header */}
      <div className="hero" style={{padding:'48px 0'}}>
        <div className="wrap" style={{position:'relative',zIndex:1,textAlign:'center'}}>
          <div className="eyebrow" style={{background:'rgba(20,184,166,.15)',borderColor:'rgba(20,184,166,.3)',color:'#99f6e4'}}>
            <Stethoscope size={11}/>تواصل معنا
          </div>
          <h1 style={{fontSize:'clamp(24px,4vw,42px)',fontWeight:900,color:'#fff',marginBottom:8}}>كيف يمكننا مساعدتك؟</h1>
          <p style={{color:'rgba(255,255,255,.52)',fontSize:15}}>نحن هنا للإجابة على استفساراتك واقتراحاتك</p>
        </div>
      </div>

      <div className="wrap" style={{padding:'48px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:32,alignItems:'start'}}>

          {/* Info */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="card" style={{padding:22}}>
              <h3 style={{fontWeight:800,fontSize:15,color:'var(--txt1)',marginBottom:16}}>معلومات التواصل</h3>
              {[
                { I:Mail,  t:'البريد الإلكتروني', v:'support@mansh-platform.com' },
                { I:Phone, t:'الدعم الفني',        v:'متاح خلال ساعات العمل' },
              ].map(({I,t,v},i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:16}}>
                  <div style={{width:38,height:38,borderRadius:10,background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <I size={16} style={{color:'var(--teal)'}}/>
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13.5,color:'var(--txt1)',marginBottom:2}}>{t}</div>
                    <div style={{fontSize:13,color:'var(--txt2)'}}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:22}}>
              <h3 style={{fontWeight:800,fontSize:14,color:'var(--txt1)',marginBottom:12}}>روابط مفيدة</h3>
              {[['/terms','شروط الاستخدام'],['/privacy','سياسة الخصوصية'],['/courses','الدورات المتاحة']].map(([h,l])=>(
                <a key={h} href={h} style={{display:'block',fontSize:13.5,color:'var(--teal)',textDecoration:'none',padding:'5px 0',borderBottom:'1px solid var(--border)',fontWeight:600}}>{l}</a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{padding:28}}>
            <h2 style={{fontSize:18,fontWeight:900,color:'var(--txt1)',marginBottom:20}}>أرسل لنا رسالة</h2>

            {success && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',borderRadius:10,background:'var(--ok-bg)',border:'1px solid rgba(5,150,105,.15)',marginBottom:18}}>
                <CheckCircle size={16} style={{color:'var(--ok)'}}/><span style={{fontSize:14,fontWeight:700,color:'var(--ok)'}}>تم إرسال رسالتك بنجاح! سنرد عليك قريباً.</span>
              </div>
            )}
            {err && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',borderRadius:10,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)',marginBottom:18}}>
                <AlertCircle size={16} style={{color:'var(--err)'}}/><span style={{fontSize:14,color:'var(--err)'}}>{err}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <Input label="الاسم الكامل *" placeholder="أحمد محمد" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                <Input label="البريد الإلكتروني *" type="email" placeholder="name@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required dir="ltr"/>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>الموضوع *</label>
                <select className="inp" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required>
                  <option value="">اختر الموضوع</option>
                  <option value="support">دعم تقني</option>
                  <option value="feedback">ملاحظات واقتراحات</option>
                  <option value="content">استفسار عن المحتوى</option>
                  <option value="partnership">فرص تعاون</option>
                  <option value="complaint">شكوى</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>الرسالة *</label>
                <textarea className="inp" style={{minHeight:130,resize:'vertical'}} placeholder="اكتب رسالتك هنا..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{alignSelf:'flex-end',minWidth:160}}>
                {loading ? <><Loader2 size={16} className="spin"/>جاري الإرسال...</> : <><Send size={15}/>إرسال الرسالة</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
