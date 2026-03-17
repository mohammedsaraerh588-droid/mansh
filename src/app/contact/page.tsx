'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('فشل إرسال الرسالة')

      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-4" style={{ background: 'var(--primary)' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black text-white mb-4">اتصل بنا</h1>
          <p className="text-white/70 text-lg">نحن هنا للإجابة على أسئلتك والاستماع إلى اقتراحاتك</p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>معلومات التواصل</h2>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
                  <Mail className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="font-black mb-2" style={{ color: 'var(--text-primary)' }}>البريد الإلكتروني</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>support@mansh-platform.com</p>
                  <p style={{ color: 'var(--text-secondary)' }}>info@mansh-platform.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
                  <Phone className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="font-black mb-2" style={{ color: 'var(--text-primary)' }}>الهاتف</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>+966 50 123 4567</p>
                  <p style={{ color: 'var(--text-secondary)' }}>ساعات العمل: السبت - الخميس، 9 صباحاً - 6 مساءً</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
                  <MapPin className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="font-black mb-2" style={{ color: 'var(--text-primary)' }}>العنوان</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>الرياض، المملكة العربية السعودية</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-black mb-4" style={{ color: 'var(--text-primary)' }}>روابط سريعة</h3>
                <div className="space-y-2">
                  <Link href="/terms" className="block" style={{ color: 'var(--gold-dark)' }}>
                    شروط وأحكام الاستخدام
                  </Link>
                  <Link href="/privacy" className="block" style={{ color: 'var(--gold-dark)' }}>
                    سياسة الخصوصية
                  </Link>
                  <Link href="/courses" className="block" style={{ color: 'var(--gold-dark)' }}>
                    الدورات المتاحة
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>أرسل لنا رسالة</h2>

              {success && (
                <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(34, 197, 94, 0.1)', borderLeft: '4px solid #22c55e' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                  <p style={{ color: '#22c55e' }}>تم إرسال رسالتك بنجاح. سنرد عليك قريباً!</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444' }}>
                  <p style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك"
                    className="w-full px-4 py-2.5 rounded-lg border transition-colors"
                    style={{
                      background: 'var(--primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border transition-colors"
                    style={{
                      background: 'var(--primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    الموضوع
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border transition-colors"
                    style={{
                      background: 'var(--primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="support">دعم تقني</option>
                    <option value="feedback">ملاحظات واقتراحات</option>
                    <option value="partnership">فرص تعاون</option>
                    <option value="complaint">شكوى</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border transition-colors resize-none"
                    style={{
                      background: 'var(--primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
