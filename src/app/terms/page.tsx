'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-4" style={{ background: 'var(--primary)' }}>
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 mb-6" style={{ color: 'var(--gold)' }}>
            <ArrowRight className="w-4 h-4" />
            العودة إلى الرئيسية
          </Link>
          <h1 className="text-4xl font-black text-white mb-4">شروط وأحكام الاستخدام</h1>
          <p className="text-white/70">آخر تحديث: 17 مارس 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert max-w-none" style={{ color: 'var(--text-primary)' }}>
            
            <h2 className="text-2xl font-black mt-8 mb-4">1. قبول الشروط</h2>
            <p>بالدخول إلى واستخدام منصة تعلّم، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام المنصة.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">2. استخدام المنصة</h2>
            <p>تلتزم بما يلي عند استخدام المنصة:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>عدم استخدام المنصة لأي غرض غير قانوني أو ضار</li>
              <li>عدم محاولة الوصول غير المصرح به إلى أنظمة المنصة</li>
              <li>عدم نسخ أو توزيع محتوى المنصة بدون إذن</li>
              <li>عدم التحرش أو إساءة المعاملة للمستخدمين الآخرين</li>
              <li>الامتثال لجميع القوانين واللوائح المعمول بها</li>
            </ul>

            <h2 className="text-2xl font-black mt-8 mb-4">3. حسابات المستخدمين</h2>
            <p>أنت مسؤول عن الحفاظ على سرية بيانات دخولك. تتعهد بعدم الكشف عن كلمة المرور الخاصة بك لأي شخص آخر. أنت وحدك المسؤول عن جميع الأنشطة التي تحدث تحت حسابك.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">4. الملكية الفكرية</h2>
            <p>جميع المحتوى على المنصة، بما في ذلك الدورات والفيديوهات والمواد التعليمية، محمي بحقوق الملكية الفكرية. لا يُسمح بنسخ أو توزيع هذا المحتوى بدون إذن صريح من المنصة.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">5. الرسوم والدفع</h2>
            <p>بعض الدورات قد تتطلب دفع رسوم. عند إجراء عملية شراء، فإنك توافق على دفع الرسوم المحددة. جميع المبيعات نهائية ولا يمكن استردادها إلا في الحالات المحددة في سياسة الاسترجاع.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">6. الشهادات</h2>
            <p>الشهادات الصادرة من المنصة تثبت إكمالك للدورة. لا تعتبر هذه الشهادات بديلاً عن المؤهلات الرسمية أو الاعتماد الأكاديمي من المؤسسات التعليمية المعترف بها.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">7. تحرير المسؤولية</h2>
            <p>توفر المنصة محتواها "كما هو" دون أي ضمانات. لا نضمن دقة أو اكتمال أو ملاءمة المحتوى لأي غرض معين. استخدام المنصة يتم على مسؤوليتك الخاصة.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">8. تعديل الشروط</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة. استمرارك في استخدام المنصة يعني قبولك للشروط المعدلة.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">9. الإنهاء</h2>
            <p>نحتفظ بالحق في إنهاء أو تعليق حسابك إذا انتهكت هذه الشروط أو أي سياسة أخرى للمنصة.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">10. الاتصال بنا</h2>
            <p>إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر صفحة الاتصال.</p>

          </div>
        </div>
      </section>
    </div>
  )
}
