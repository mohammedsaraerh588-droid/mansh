import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const POLLINATIONS_URL = 'https://text.pollinations.ai/'

const SYSTEM = `أنت مساعد تعليمي طبي متخصص للمعلمين على منصة تعلّم الطبية.
مهمتك مساعدة المعلمين في:
- إعداد المحتوى التعليمي الطبي وشرح المفاهيم الطبية بأسلوب واضح
- إنشاء أسئلة MCQ للاختبارات الطبية
- تحليل الملفات والوثائق الطبية
- اقتراح خطط دراسية وأساليب التدريس
أجب دائماً باللغة العربية بأسلوب علمي واضح ومنظم.`

async function callAI(messages: any[], retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(POLLINATIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model:  'openai',
          stream: false,
          seed:   Math.floor(Math.random() * 9999),
        }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 100)}`)
      }
      const text = await res.text()
      if (!text?.trim()) throw new Error('Empty response')
      return text.trim()
    } catch (e: any) {
      if (attempt === retries - 1) throw e
      await new Promise(r => setTimeout(r, 1200 * (attempt + 1)))
    }
  }
  throw new Error('Failed after retries')
}

export async function POST(req: Request) {
  try {
    // تحقق من صلاحيات المعلم
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', session.user.id).single()
    if (!['teacher', 'admin'].includes(profile?.role))
      return NextResponse.json({ error: 'ليس لديك صلاحية استخدام المساعد الذكي' }, { status: 403 })

    const formData = await req.formData()
    const mode    = formData.get('mode') as string
    const message = (formData.get('message') as string) || ''
    const history = JSON.parse((formData.get('history') as string) || '[]')
    const file    = formData.get('file') as File | null

    // ── تحليل ملف ───────────────────────────────
    if (file) {
      let fileContent = ''
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        fileContent = await file.text()
      } else if (file.type === 'application/pdf') {
        fileContent = `[ملف PDF: ${file.name} - الحجم: ${Math.round(file.size/1024)}KB]\nملاحظة: تحليل PDF محدود في هذه النسخة.`
      } else if (file.type.startsWith('image/')) {
        fileContent = `[صورة: ${file.name} - ${file.type}]`
      } else {
        fileContent = `[ملف: ${file.name} - ${file.type}]`
      }
      const prompt = message || 'حلّل هذا المحتوى وقدّم ملخصاً شاملاً مع أبرز النقاط الطبية.'
      const msgs = [
        { role: 'system',    content: SYSTEM },
        { role: 'user', content: `${prompt}\n\nمحتوى الملف:\n${fileContent.slice(0, 8000)}` }
      ]
      const text = await callAI(msgs)
      return NextResponse.json({ text })
    }

    // ── توليد أسئلة MCQ ─────────────────────────
    if (mode === 'quiz') {
      const count = formData.get('count') || '5'
      const msgs = [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `أنشئ ${count} أسئلة MCQ طبية عن: "${message}"
كل سؤال: 4 خيارات (أ ب ج د)، إجابة صحيحة واحدة، تنوع بين التذكر والفهم والتطبيق.
أجب بـ JSON فقط بدون أي نص خارجي أو markdown:
[{"question":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_option":"option_a","explanation":"..."}]` }
      ]
      const raw   = await callAI(msgs)
      const clean = raw.replace(/```json\n?|\n?```/g, '').trim()
      try   { return NextResponse.json({ questions: JSON.parse(clean), text: raw }) }
      catch { return NextResponse.json({ text: raw }) }
    }

    // ── محادثة عادية ────────────────────────────
    const msgs = [
      { role: 'system', content: SYSTEM },
      ...history.map((h: any) => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.text })),
      { role: 'user', content: message }
    ]
    const text = await callAI(msgs)
    return NextResponse.json({ text })

  } catch (err: any) {
    console.error('[AI_ERROR]', err)
    const msg = err?.message || 'خطأ غير معروف'
    return NextResponse.json({ error: `❌ ${msg}` }, { status: 500 })
  }
}
