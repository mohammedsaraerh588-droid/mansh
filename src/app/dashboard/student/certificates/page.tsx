'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Award, Download, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('certificates')
        .select(`
          id,
          issued_at,
          verification_code,
          certificate_url,
          courses ( title, title_ar )
        `)
        .eq('student_id', session.user.id)
        .order('issued_at', { ascending: false })
      
      setCertificates(data || [])
      setLoading(false)
    }
    
    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">الشهادات</h1>
        <p className="text-text-secondary">سجل جميع دوراتك المكتملة وشهاداتك المعتمدة</p>
      </div>

      {certificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6 text-text-muted border border-border">
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-3">لم تحصل على أي شهادة بعد</h3>
          <p className="text-text-secondary mb-6">أكمل دوراتك بنسبة 100% للحصول على شهادات معتمدة</p>
          <Link href="/dashboard/student/courses">
            <Button variant="primary">متابعة التعلم</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="glass-card flex flex-col items-center text-center p-6 border-2 border-primary/10 hover:border-primary/30 transition-all shadow-sm">
              <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4 text-yellow-600 border border-yellow-200">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-secondary">{cert.courses?.title}</h3>
              <p className="text-sm text-text-secondary mb-4">
                تاريخ الإصدار: {new Date(cert.issued_at).toLocaleDateString('ar-EG')}
              </p>
              
              <div className="text-xs text-text-muted bg-surface-2 px-3 py-1.5 rounded-lg mb-6 w-full break-all border border-border cursor-copy">
                رمز التحقق: {cert.verification_code}
              </div>

              <div className="flex gap-3 w-full mt-auto">
                <Button variant="secondary" className="flex-1 text-xs py-2 shadow-none" disabled={!cert.certificate_url}>
                  <Download className="w-4 h-4 ml-1" />
                  تحميل
                </Button>
                <Button variant="ghost" className="flex-1 text-xs py-2 bg-surface-2">
                  <ExternalLink className="w-4 h-4 ml-1" />
                  مشاركة
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
