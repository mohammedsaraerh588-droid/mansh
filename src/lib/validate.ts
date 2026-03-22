/**
 * دوال التحقق من المدخلات
 * تُستخدم في جميع الـ API routes لحماية المنصة
 */

/** تحقق من وجود الحقول المطلوبة */
export function requireFields(obj: Record<string, any>, fields: string[]): string | null {
  for (const f of fields) {
    const val = obj[f]
    if (val === undefined || val === null || val === '') {
      return `الحقل "${f}" مطلوب`
    }
  }
  return null
}

/** تنظيف النص من الرموز الخطيرة */
export function sanitizeStr(val: unknown, maxLen = 1000): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, maxLen)
}

/** التحقق من صحة UUID */
export function isValidUUID(val: unknown): boolean {
  if (typeof val !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
}

/** التحقق من نطاق الرقم */
export function isInRange(val: unknown, min: number, max: number): boolean {
  const n = Number(val)
  return !isNaN(n) && n >= min && n <= max
}

/** رد خطأ موحّد */
export function validationError(msg: string) {
  return Response.json({ error: msg }, { status: 400 })
}
