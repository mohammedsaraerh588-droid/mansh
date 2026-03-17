'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Loader2, PlayCircle } from 'lucide-react'

interface EnrollButtonProps {
  courseId: string;
  price: number;
  isEnrolled: boolean;
  slug: string;
}

export default function EnrollButton({ courseId, price, isEnrolled, slug }: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    if (isEnrolled) {
      router.push(`/courses/${slug}/learn`)
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        throw new Error('حدث خطأ أثناء إعداد صفحة الدفع')
      }

      const { url } = await response.json()
      window.location.href = url // Redirect to Stripe Checkout

    } catch (error) {
      console.error(error)
      alert('نعتذر، حدثت مشكلة. يرجى المحاولة لاحقاً.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant={isEnrolled ? "secondary" : "primary"}
      size="lg" 
      className="w-full mb-4 shadow-primary/20"
      onClick={handleEnroll}
      isLoading={loading}
      leftIcon={isEnrolled ? <PlayCircle className="w-5 h-5"/> : undefined}
    >
      {isEnrolled ? 'متابعة التعلم' : price === 0 ? 'سجل مجاناً الآن' : 'اشترك الآن بضمان 14 يوم'}
    </Button>
  )
}
