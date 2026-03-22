import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'

export async function POST(req: Request) {
  // ⛔ Rate limit: 20 محاولة كل دقيقة لمنع تخمين الكودات
  if (isRateLimited(getIP(req), { limit: 20, window: 60 })) {
    return NextResponse.json(
      { error: 'محاولات كثيرة جداً، يرجى الانتظار ثم المحاولة.', valid: false },
      { status: 429 }
    )
  }
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, courseId } = await req.json()
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

  // البحث عن الكوبون
  const { data: coupon } = await supabase.from('coupons')
    .select('*').eq('code', code.toUpperCase().trim()).maybeSingle()

  if (!coupon) return NextResponse.json({ error: 'الكوبون غير صحيح' }, { status: 404 })
  if (!coupon.is_active) return NextResponse.json({ error: 'الكوبون غير نشط' }, { status: 400 })
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return NextResponse.json({ error: 'انتهت صلاحية الكوبون' }, { status: 400 })
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
    return NextResponse.json({ error: 'تم استنفاد الكوبون' }, { status: 400 })
  if (coupon.course_id && coupon.course_id !== courseId)
    return NextResponse.json({ error: 'هذا الكوبون لدورة مختلفة' }, { status: 400 })

  return NextResponse.json({
    ok:           true,
    discount:     coupon.discount_percent,
    couponId:     coupon.id,
    description:  `خصم ${coupon.discount_percent}%`,
  })
}
