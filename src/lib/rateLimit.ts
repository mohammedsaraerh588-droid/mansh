/**
 * Rate Limiter بسيط بدون أي مكتبة خارجية
 * يحفظ عدد الطلبات في الذاكرة مؤقتاً
 */

// خريطة: IP → { عدد الطلبات، وقت البداية }
const map = new Map<string, { count: number; start: number }>()

// تنظيف تلقائي كل 5 دقائق لمنع تراكم الذاكرة
setInterval(() => {
  const now = Date.now()
  map.forEach((v, k) => {
    if (now - v.start > 5 * 60 * 1000) map.delete(k)
  })
}, 5 * 60 * 1000)

interface Options {
  limit:    number  // الحد الأقصى للطلبات
  window:   number  // النافزة الزمنية بالثواني
}

/**
 * تحقق من Rate Limit
 * @returns true إذا تجاوز الحد → ارفض الطلب
 */
export function isRateLimited(ip: string, opts: Options): boolean {
  const now    = Date.now()
  const window = opts.window * 1000
  const entry  = map.get(ip)

  if (!entry || now - entry.start > window) {
    // طلب جديد أو انتهت النافذة الزمنية — أعد العداد
    map.set(ip, { count: 1, start: now })
    return false
  }

  if (entry.count >= opts.limit) return true  // تجاوز الحد

  entry.count++
  return false
}

/** اجلب IP المستخدم من الطلب */
export function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
