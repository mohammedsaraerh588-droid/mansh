import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

function Section({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div style={{marginBottom:28}}>
      <h2 style={{fontSize:18,fontWeight:800,color:'var(--txt1)',marginBottom:10,paddingBottom:8,borderBottom:'2px solid var(--teal-soft)'}}>{title}</h2>
      <div style={{fontSize:14.5,color:'var(--txt2)',lineHeight:1.85}}>{children}</div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <div className="hero" style={{padding:'48px 0'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center'}}><Stethoscope size={18} style={{color:'#fff'}}/></div>
            <span style={{fontWeight:900,fontSize:16,color:'#fff'}}>منصة تعلّم الطبية</span>
          </div>
          <h1 style={{fontSize:'clamp(26px,4vw,44px)',fontWeight:900,color:'#fff',marginBottom:8}}>شروط وأحكام الاستخدام</h1>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:14}}>آخر تحديث: مارس 2026</p>
        </div>
      </div>

      <div className="wrap" style={{padding:'48px 20px'}}>
        <div style={{maxWidth:760}}>
          <Section title="1. قبول الشروط">
            <p>بالدخول إلى منصة تعلّم الطبية واستخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يرجى عدم استخدام المنصة.</p>
          </Section>
          <Section title="2. استخدام المنصة">
            <ul style={{paddingRight:18,display:'flex',flexDirection:'column',gap:6}}>
              {['عدم استخدام المنصة لأي غرض غير قانوني','عدم محاولة الوصول غير المصرح به للأنظمة','عدم نسخ أو توزيع محتوى المنصة بدون إذن','الامتثال لجميع القوانين واللوائح المعمول بها'].map((t,i)=>(
                <li key={i} style={{listStyle:'disc'}}>{t}</li>
              ))}
            </ul>
          </Section>
          <Section title="3. حسابات المستخدمين">
            <p>أنت مسؤول عن الحفاظ على سرية بيانات دخولك وجميع الأنشطة التي تحدث تحت حسابك.</p>
          </Section>
          <Section title="4. الملكية الفكرية">
            <p>جميع المحتوى على المنصة محمي بحقوق الملكية الفكرية. لا يُسمح بنسخ أو توزيع هذا المحتوى بدون إذن صريح.</p>
          </Section>
          <Section title="5. الرسوم والدفع">
            <p>بعض الدورات تتطلب رسوماً. جميع المبيعات نهائية وفق سياسة الاسترجاع المعتمدة.</p>
          </Section>
          <Section title="6. الشهادات">
            <p>شهادات الإتمام تثبت إكمالك للدورة وهي ذات طابع تعليمي داخلي ولا تُعتبر بديلاً عن المؤهلات الرسمية.</p>
          </Section>
          <Section title="7. تعديل الشروط">
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إشعارك بالتغييرات الجوهرية.</p>
          </Section>
          <Section title="8. الاتصال بنا">
            <p>للاستفسار عن الشروط، <Link href="/contact" style={{color:'var(--teal)',fontWeight:700,textDecoration:'none'}}>تواصل معنا</Link>.</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
