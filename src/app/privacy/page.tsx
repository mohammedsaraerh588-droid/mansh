'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-4" style={{ background: 'var(--primary)' }}>
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 mb-6" style={{ color: 'var(--gold)' }}>
            <ArrowRight className="w-4 h-4" />
            العودة إلى الرئيسية
          </Link>
          <h1 className="text-4xl font-black text-white mb-4">سياسة الخصوصية</h1>
          <p className="text-white/70">آخر تحديث: 17 مارس 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert max-w-none" style={{ color: 'var(--text-primary)' }}>
            
            <h2 className="text-2xl font-black mt-8 mb-4">1. مقدمة</h2>
            <p>نحن في منصة تعلّم نقدّر خصوصيتك. تشرح هذه السياسة كيف نجمع ونستخدم ونحمي بيانات المستخدمين.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">2. البيانات التي نجمعها</h2>
            <p>قد نجمع البيانات التالية:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li><strong>بيانات التسجيل:</strong> الاسم، البريد الإلكتروني، كلمة المرور، رقم الهاتف</li>
              <li><strong>بيانات الملف الشخصي:</strong> الصورة الشخصية، السيرة الذاتية، الاهتمامات</li>
              <li><strong>بيانات الاستخدام:</strong> الدورات التي تتابعها، الدروس المكتملة، الوقت المقضي</li>
              <li><strong>بيانات الدفع:</strong> معلومات بطاقة الائتمان (معالجة بواسطة Stripe بشكل آمن)</li>
              <li><strong>بيانات الجهاز:</strong> عنوان IP، نوع المتصفح، نظام التشغيل</li>
            </ul>

            <h2 className="text-2xl font-black mt-8 mb-4">3. كيف نستخدم بيانات المستخدمين</h2>
            <p>نستخدم البيانات التي نجمعها لـ:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>توفير وتحسين خدمات المنصة</li>
              <li>إرسال تحديثات والإشعارات المتعلقة بحسابك</li>
              <li>معالجة المدفوعات والفواتير</li>
              <li>تحليل استخدام المنصة وتحسينها</li>
              <li>الامتثال للمتطلبات القانونية</li>
              <li>منع الاحتيال والنشاطات غير القانونية</li>
            </ul>

            <h2 className="text-2xl font-black mt-8 mb-4">4. مشاركة البيانات</h2>
            <p>لا نشارك بيانات المستخدمين مع أطراف ثالثة إلا في الحالات التالية:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>عندما يكون ذلك ضروريًا لتقديم الخدمة (مثل معالجات الدفع)</li>
              <li>عندما يكون ذلك مطلوبًا بموجب القانون</li>
              <li>بموافقتك الصريحة</li>
            </ul>

            <h2 className="text-2xl font-black mt-8 mb-4">5. أمان البيانات</h2>
            <p>نستخدم تقنيات التشفير والإجراءات الأمنية لحماية بيانات المستخدمين. ومع ذلك، لا يمكن ضمان أمان كامل على الإنترنت.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">6. ملفات تعريف الارتباط (Cookies)</h2>
            <p>تستخدم المنصة ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">7. حقوقك</h2>
            <p>لديك الحق في:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>الوصول إلى بيانات المستخدم الخاصة بك</li>
              <li>تصحيح البيانات غير الصحيحة</li>
              <li>حذف حسابك وبيانات المستخدم الخاصة بك</li>
              <li>الاعتراض على معالجة بيانات المستخدم</li>
            </ul>

            <h2 className="text-2xl font-black mt-8 mb-4">8. الاحتفاظ بالبيانات</h2>
            <p>نحتفظ ببيانات المستخدم طالما كان حسابك نشطًا أو حسب الحاجة لتقديم الخدمات. يمكنك طلب حذف بيانات المستخدم الخاصة بك في أي وقت.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">9. تغييرات على سياسة الخصوصية</h2>
            <p>قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية.</p>

            <h2 className="text-2xl font-black mt-8 mb-4">10. الاتصال بنا</h2>
            <p>إذا كان لديك أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة الاتصال.</p>

          </div>
        </div>
      </section>
    </div>
  )
}
