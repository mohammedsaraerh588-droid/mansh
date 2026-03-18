'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PlayCircle, BookOpen } from 'lucide-react'

interface Props { courseId:string; price:number; isEnrolled:boolean; slug:string }

export default function EnrollButton({ courseId, price, isEnrolled, slug }: Props) {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)

  const handle = async () => {
    if (isEnrolled) { router.push(`/courses/${slug}/learn`); return }
    try {
      setBusy(true)
      const res = await fetch('/api/checkout', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ courseId }),
      })
      if (res.status===401) { router.push('/auth/login'); return }
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      window.location.href = url
    } catch { alert('حدث خطأ، يرجى المحاولة لاحقاً.') }
    finally { setBusy(false) }
  }

  return (
    <button onClick={handle} disabled={busy} className="btn btn-primary btn-lg btn-full">
      {busy
        ? <><Loader2 size={17} className="spin"/>جاري التسجيل...</>
        : isEnrolled
          ? <><PlayCircle size={17}/>متابعة التعلم</>
          : price===0
            ? <><BookOpen size={17}/>سجّل مجاناً الآن</>
            : <><BookOpen size={17}/>اشترك الآن — {price}$</>}
    </button>
  )
}
