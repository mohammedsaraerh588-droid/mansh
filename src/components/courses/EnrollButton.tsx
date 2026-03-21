'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PlayCircle, BookOpen, Tag, CheckCircle, XCircle } from 'lucide-react'

interface Props { courseId:string; price:number; isEnrolled:boolean; slug:string }

export default function EnrollButton({ courseId, price, isEnrolled, slug }: Props) {
  const router = useRouter()
  const [busy,       setBusy]       = useState(false)
  const [coupon,     setCoupon]     = useState('')
  const [couponData, setCouponData] = useState<any>(null)
  const [couponErr,  setCouponErr]  = useState('')
  const [checking,   setChecking]   = useState(false)

  const checkCoupon = async () => {
    if (!coupon.trim()) return
    setChecking(true); setCouponErr(''); setCouponData(null)
    const r = await fetch('/api/coupon', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: coupon, courseId }),
    })
    const d = await r.json()
    if (d.valid) setCouponData(d)
    else setCouponErr(d.error || 'كود غير صالح')
    setChecking(false)
  }

  const finalPrice = couponData
    ? Math.max(0, price - (price * couponData.discount_percent / 100))
    : price

  const handle = async () => {
    if (isEnrolled) { router.push(`/courses/${slug}/learn`); return }
    try {
      setBusy(true)
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, couponCode: couponData?.code }),
      })
      if (res.status === 401) { router.push('/auth/login'); return }
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      window.location.href = url
    } catch { alert('حدث خطأ، يرجى المحاولة لاحقاً.') }
    finally { setBusy(false) }
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {/* حقل الكوبون — فقط للدورات المدفوعة وغير المسجّل */}
      {!isEnrolled && price > 0 && (
        <div>
          <div style={{display:'flex',gap:7}}>
            <div style={{flex:1,position:'relative'}}>
              <Tag size={13} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',color:'var(--tx3)'}}/>
              <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==='Enter'&&checkCoupon()}
                placeholder="كود الخصم (اختياري)"
                style={{width:'100%',padding:'9px 32px 9px 10px',borderRadius:9,border:`1.5px solid ${couponData?'var(--ok)':couponErr?'var(--err)':'var(--brd)'}`,background:'var(--surface2)',color:'var(--tx1)',fontSize:13,fontFamily:'inherit',outline:'none',direction:'ltr'}}/>
            </div>
            <button onClick={checkCoupon} disabled={checking||!coupon} className="btn btn-outline btn-sm" style={{whiteSpace:'nowrap'}}>
              {checking?<Loader2 size={12} className="spin"/>:'تطبيق'}
            </button>
          </div>
          {couponData && (
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5,fontSize:12,color:'var(--ok)'}}>
              <CheckCircle size={12}/>
              خصم {couponData.discount_percent}% — السعر بعد الخصم: {finalPrice===0?'مجاني':`${finalPrice.toFixed(0)}$`}
            </div>
          )}
          {couponErr && (
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5,fontSize:12,color:'var(--err)'}}>
              <XCircle size={12}/>{couponErr}
            </div>
          )}
        </div>
      )}

      <button onClick={handle} disabled={busy} className="btn-register btn-full" style={{justifyContent:'center',padding:'12px 20px',fontSize:15}}>
        {busy
          ? <><Loader2 size={17} className="spin"/>جاري التسجيل...</>
          : isEnrolled
            ? <><PlayCircle size={17}/>متابعة التعلم</>
            : finalPrice === 0
              ? <><BookOpen size={17}/>سجّل مجاناً الآن</>
              : <><BookOpen size={17}/>اشترك — {finalPrice.toFixed(0)}$</>}
      </button>
    </div>
  )
}
