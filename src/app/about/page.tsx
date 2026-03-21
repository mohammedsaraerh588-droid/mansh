'use client'
import { useState } from 'react'
import { Stethoscope, Target, Eye, Heart, GraduationCap, BookOpen } from 'lucide-react'
import Link from 'next/link'

const values = [
  { I: Target,   t: 'الدقة العلمية',   d: 'كل محتوى مراجَع بمعايير علمية صارمة من متخصصين في مجالاتهم.' },
  { I: Heart,    t: 'الشغف بالتعليم',  d: 'نؤمن بأن التعليم الطبي الجيد يُنقذ أرواحاً ويبني مجتمعاً صحياً.' },
  { I: Eye,      t: 'الشفافية',        d: 'نكون واضحين دائماً في المحتوى والأسعار والمعلومات المقدمة.' },
  { I: BookOpen, t: 'التعلم المستمر',  d: 'نحدّث محتوانا باستمرار لمواكبة أحدث المستجدات الطبية.' },
]

function ValueCard({ I, t, d }: { I: any; t: string; d: string }) {
  const [h, setH] = useState(false)
  return (
    <div className="card"
      style={{ padding: '22px 20px', transition: 'all .2s',
        borderColor: h ? 'var(--brd2)' : 'var(--brd)',
        transform: h ? 'translateY(-2px)' : 'none' }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-light)', border: '1px solid var(--brand-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <I size={18} style={{ color: 'var(--brand)' }} />
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx1)', marginBottom: 6 }}>{t}</h3>
      <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.7 }}>{d}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      <div className="hero" style={{ padding: '72px 0 64px', textAlign: 'center' }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow"><Stethoscope size={11} />من نحن</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-.025em', marginBottom: 16 }}>
            منصة تعليمية طبية<br />
            <span className="g-text">بنيناها لأجل الطلاب</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            منصة متخصصة في التعليم الطبي تهدف إلى تقديم محتوى علمي دقيق لطلاب الطب والمتخصصين الصحيين.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 48 }}>
          <div className="card" style={{ padding: '28px 26px', borderTop: '3px solid var(--brand)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--brand-light)', border: '1px solid var(--brand-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Target size={20} style={{ color: 'var(--brand)' }} />
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx1)', marginBottom: 10 }}>رسالتنا</h2>
            <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.8 }}>توفير تعليم طبي عالي الجودة ومتاح للجميع، من خلال محتوى علمي دقيق ومراجَع من متخصصين، بأسلوب تفاعلي وسهل الفهم.</p>
          </div>
          <div className="card" style={{ padding: '28px 26px', borderTop: '3px solid var(--brand)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--brand-light)', border: '1px solid var(--brand-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Eye size={20} style={{ color: 'var(--brand)' }} />
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx1)', marginBottom: 10 }}>رؤيتنا</h2>
            <p style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.8 }}>أن نكون المرجع الأول للتعليم الطبي التفاعلي في العالم العربي، ونساهم في رفع مستوى الكفاءة الطبية للأجيال القادمة.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx1)', marginBottom: 24, letterSpacing: '-.01em' }}>قيمنا</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {values.map(({ I, t, d }, i) => <ValueCard key={i} I={I} t={t} d={d} />)}
          </div>
        </div>

        <div className="card" style={{ padding: '40px 32px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(14,165,233,.06) 0%,rgba(6,182,212,.04) 100%)', border: '1px solid var(--brd2)' }}>
          <GraduationCap size={36} style={{ color: 'var(--brand)', margin: '0 auto 14px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tx1)', marginBottom: 10, letterSpacing: '-.01em' }}>ابدأ رحلتك الطبية معنا</h2>
          <p style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 22 }}>سجّل الآن وانضم لمجتمع الطلاب الطبيين</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/courses" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}><BookOpen size={15} />الدورات</Link>
            <Link href="/auth/register" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>إنشاء حساب</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
