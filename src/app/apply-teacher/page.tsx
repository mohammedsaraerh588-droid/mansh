'use client'
import { useState } from 'react'
import { Stethoscope, Send, CheckCircle, User, Mail, BookOpen, FileText } from 'lucide-react'

export default function ApplyTeacherPage() {
  const [form, setForm] = useState({ name:'', email:'', specialty:'', experience:'', bio:'', links:'' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const SPECIALTIES = ['أمراض القلب','طب الأعصاب','طب الأسنان','الصيدلة السريرية','علم الأحياء الجزيئي','أمراض الصدر','طب الطوارئ','علم الأمراض','جراحة العظام','طب العيون','أمراض الكلى','طب الأطفال','أخرى']

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true)
    await fetch('/api/contact', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        name:    form.name,
        email:   form.email,
        message: `🎓 طلب تسجيل معلم جديد\n\nالتخصص: ${form.specialty}\nسنوات الخبرة: ${form.experience}\n\nنبذة: ${form.bio}\n\nروابط: ${form.links}`,
        subject: 'طلب تسجيل معلم',
      }),
    })
    setSent(true); setSending(false)
  }

  if (sent) return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',padding:24}}>
      <div style={{textAlign:'center',maxWidth:420}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--ok-bg)',border:'2px solid var(--ok-brd)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <CheckCircle size={36} style={{color:'var(--ok)'}}/>
        </div>
        <h2 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:10}}>تم إرسال طلبك!</h2>
        <p style={{fontSize:14,color:'var(--tx3)',lineHeight:1.8}}>
          شكراً لاهتمامك! سيراجع فريقنا طلبك وسنتواصل معك خلال 2-3 أيام عمل على البريد الإلكتروني المُدخَل.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:60}}>
      <div className="hero" style={{padding:'52px 0 48px',textAlign:'center'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div className="eyebrow"><Stethoscope size={11}/>انضم لفريقنا</div>
          <h1 style={{fontSize:'clamp(22px,4vw,40px)',fontWeight:900,color:'#fff',letterSpacing:'-.02em',marginBottom:10}}>
            التقديم كمعلم على المنصة
          </h1>
          <p style={{color:'rgba(255,255,255,.55)',fontSize:15,maxWidth:480,margin:'0 auto'}}>
            شارك معرفتك الطبية وساعد الطلاب على التميز
          </p>
        </div>
      </div>

      <div className="wrap-sm" style={{paddingTop:36}}>
        <div className="card" style={{padding:'28px 32px'}}>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:18}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                  <User size={11} style={{marginLeft:4}}/>الاسم الكامل *
                </label>
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  placeholder="د. محمد أحمد"
                  className="inp"/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                  <Mail size={11} style={{marginLeft:4}}/>البريد الإلكتروني *
                </label>
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  placeholder="doctor@example.com"
                  className="inp" dir="ltr"/>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                  <BookOpen size={11} style={{marginLeft:4}}/>التخصص الطبي *
                </label>
                <select required value={form.specialty} onChange={e=>setForm(f=>({...f,specialty:e.target.value}))}
                  className="inp" style={{cursor:'pointer'}}>
                  <option value="">اختر التخصص</option>
                  {SPECIALTIES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                  سنوات الخبرة *
                </label>
                <select required value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))}
                  className="inp" style={{cursor:'pointer'}}>
                  <option value="">اختر</option>
                  {['أقل من سنة','1-3 سنوات','3-5 سنوات','5-10 سنوات','أكثر من 10 سنوات'].map(x=><option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                <FileText size={11} style={{marginLeft:4}}/>نبذة عنك ومؤهلاتك *
              </label>
              <textarea required value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}
                placeholder="اكتب نبذة مختصرة عن خبرتك ومؤهلاتك العلمية..."
                rows={4} className="inp" style={{resize:'vertical'}}/>
            </div>

            <div>
              <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>
                روابط (LinkedIn، Orcid، موقع شخصي...)
              </label>
              <input value={form.links} onChange={e=>setForm(f=>({...f,links:e.target.value}))}
                placeholder="https://linkedin.com/in/..."
                className="inp" dir="ltr"/>
            </div>

            <div style={{background:'var(--alpha-green-l)',border:'1px solid var(--alpha-green-m)',borderRadius:10,padding:'12px 16px',fontSize:13,color:'var(--alpha-green-2)',lineHeight:1.7}}>
              📋 سيراجع فريقنا طلبك خلال 2-3 أيام عمل، وسنتواصل معك لإنشاء حسابك كمعلم وبدء رفع المحتوى.
            </div>

            <button type="submit" disabled={sending} className="btn-register btn-full" style={{justifyContent:'center',padding:'12px 20px',fontSize:15}}>
              {sending ? 'جاري الإرسال...' : <><Send size={16}/>إرسال الطلب</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
