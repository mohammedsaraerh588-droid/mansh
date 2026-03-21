'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Stethoscope, BookOpen } from 'lucide-react'
import Link from 'next/link'

const FAQS = [
  { q: 'ما هي منصة تعلّم الطبية؟', a: 'منصة تعليمية متخصصة لطلاب الطب والمتخصصين الصحيين، تقدم دورات علمية دقيقة في جميع التخصصات الطبية بأسلوب تفاعلي واضح.' },
  { q: 'هل المحتوى مجاني؟', a: 'يوجد دورات مجانية ودورات مدفوعة. يمكنك تصفح جميع الدورات والتسجيل في المجانية مجاناً دون إدخال بيانات الدفع.' },
  { q: 'كيف أحصل على شهادة الإتمام؟', a: 'عند إكمالك 100% من الدورة (مشاهدة جميع الدروس وإجتياز الاختبارات)، تُصدر شهادة إتمام رقمية تلقائياً في لوحة التحكم.' },
  { q: 'هل يمكنني التعلم من الهاتف؟', a: 'نعم، المنصة متوافقة مع جميع الأجهزة — الهاتف والتابلت والحاسوب.' },
  { q: 'كيف أصبح معلماً على المنصة؟', a: 'تواصل معنا عبر صفحة التواصل مع ذكر تخصصك وخبرتك، وسيتم مراجعة طلبك وإنشاء حساب معلم لك.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'ندعم بطاقات Visa وMastercard وAmerican Express عبر Stripe الآمن. جميع المعاملات مشفرة بالكامل.' },
  { q: 'هل يمكنني استرداد المبلغ بعد الشراء؟', a: 'نعم، نوفر سياسة استرداد خلال 7 أيام من تاريخ الشراء إذا لم تشاهد أكثر من 20% من الدورة. تواصل معنا لمعالجة الطلب.' },
  { q: 'هل الاختبارات إلزامية؟', a: 'الاختبارات اختيارية لكنها تساعدك على قياس فهمك ومراجعة المادة. تحتاج لاجتيازها لإكمال الدورة بنسبة 100%.' },
  { q: 'كم مرة يمكنني مشاهدة الدروس؟', a: 'يمكنك مشاهدة الدروس بلا حدود — في أي وقت وعدد مرات غير محدود طالما كنت مسجلاً في الدورة.' },
  { q: 'هل يمكنني إضافة ملاحظات أثناء التعلم؟', a: 'نعم، يمكنك كتابة ملاحظات خاصة على كل درس من داخل صفحة التعلم وحفظها لمراجعتها لاحقاً.' },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card" style={{ overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'right', fontFamily: 'inherit' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx1)', flex: 1 }}>{q}</span>
        {open ? <ChevronUp size={18} style={{ color: 'var(--brand)', flexShrink: 0 }}/> : <ChevronDown size={18} style={{ color: 'var(--tx3)', flexShrink: 0 }}/>}
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'var(--tx2)', lineHeight: 1.8, borderTop: '1px solid var(--brd)' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      <div className="hero" style={{ padding: '64px 0 56px', textAlign: 'center' }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }}>
            <Stethoscope size={11}/>الأسئلة الشائعة
          </div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 12 }}>
            هل لديك سؤال؟
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', maxWidth: 460, margin: '0 auto' }}>
            نجيب على أكثر الأسئلة شيوعاً. إذا لم تجد إجابتك، تواصل معنا.
          </p>
        </div>
      </div>

      <div className="wrap-md" style={{ paddingTop: 40 }}>
        {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}

        <div className="card" style={{ padding: '32px 28px', textAlign: 'center', marginTop: 28, background: 'linear-gradient(135deg,var(--brand-l),var(--teal-l))' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx1)', marginBottom: 8 }}>لم تجد إجابتك؟</h3>
          <p style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 18 }}>فريقنا مستعد للمساعدة في أي وقت</p>
          <Link href="/contact" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  )
}
