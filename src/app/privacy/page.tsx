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

export default function PrivacyPage() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <div className="hero" style={{padding:'48px 0'}}>
        <div className="wrap" style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center'}}><Stethoscope size={18} style={{color:'#fff'}}/></div>
            <span style={{fontWeight:900,fontSize:16,color:'#fff'}}>منصة تعلّم الطبية</span>
          </div>
          <h1 style={{fontSize:'clamp(26px,4vw,44px)',fontWeight:900,color:'#fff',marginBottom:8}}>سياسة الخصوصية</h1>
          <p style={{color:'rgba(255,255,255,.5)',fontSize:14}}>آخر تحديث: مارس 2026</p>
        </div>
      </div>

      <div className="wrap" style={{padding:'48px 20px'}}>
        <div style={{maxWidth:760}}>
          <Section title="1. مقدمة">
            <p>نحن في منصة تعلّم الطبية نقدّر خصوصيتك. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي بيانات المستخدمين.</p>
          </Section>
          <Section title="2. البيانات التي نجمعها">
            <ul style={{paddingRight:18,display:'flex',flexDirection:'column',gap:6}}>
              {['بيانات التسجيل: الاسم، البريد الإلكتروني، كلمة المرور','بيانات الملف الشخصي: الصورة الشخصية، السيرة الذاتية','بيانات الاستخدام: الدورات، الدروس المكتملة، الوقت المقضي','بيانات الدفع: تُعالَج بشكل آمن عبر Stripe','بيانات الجهاز: عنوان IP، نوع المتصفح'].map((t,i)=>(
                <li key={i} style={{listStyle:'disc'}}>{t}</li>
              ))}
            </ul>
          </Section>
          <Section title="3. كيف نستخدم بياناتك">
            <ul style={{paddingRight:18,display:'flex',flexDirection:'column',gap:6}}>
              {['توفير وتحسين خدمات المنصة','إرسال الإشعارات المتعلقة بحسابك','معالجة المدفوعات والفواتير','تحليل استخدام المنصة وتطويرها','الامتثال للمتطلبات القانونية'].map((t,i)=>(
                <li key={i} style={{listStyle:'disc'}}>{t}</li>
              ))}
            </ul>
          </Section>
          <Section title="4. مشاركة البيانات">
            <p>لا نشارك بياناتك مع أطراف ثالثة إلا عند الضرورة لتقديم الخدمة، أو بموجب القانون، أو بموافقتك الصريحة.</p>
          </Section>
          <Section title="5. أمان البيانات">
            <p>نستخدم تقنيات التشفير والإجراءات الأمنية لحماية بياناتك. ومع ذلك لا يمكن ضمان أمان كامل عبر الإنترنت.</p>
          </Section>
          <Section title="6. حقوقك">
            <ul style={{paddingRight:18,display:'flex',flexDirection:'column',gap:6}}>
              {['الوصول إلى بياناتك الشخصية','تصحيح البيانات غير الصحيحة','حذف حسابك وبياناتك','الاعتراض على معالجة بياناتك'].map((t,i)=>(
                <li key={i} style={{listStyle:'disc'}}>{t}</li>
              ))}
            </ul>
          </Section>
          <Section title="7. الاتصال بنا">
            <p>إذا كان لديك أسئلة، يرجى <Link href="/contact" style={{color:'var(--teal)',fontWeight:700,textDecoration:'none'}}>التواصل معنا</Link>.</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
