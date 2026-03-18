import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

const SYS = `أنت مساعد تعليمي طبي متخصص للمعلمين على منصة تعلّم الطبية.
مهمتك مساعدة المعلمين في إعداد المحتوى الطبي، شرح المفاهيم، إنشاء أسئلة MCQ، وتحليل الملفات.
أجب دائماً باللغة العربية بأسلوب علمي واضح ومنظم.`

// نجرب نماذج متعددة — الأسرع والأوفر مجاناً أولاً
const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
]

async function tryModels(fn: (model: any) => Promise<string>): Promise<string> {
  let lastErr: any
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, safetySettings: SAFETY, systemInstruction: SYS })
      return await fn(model)
    } catch (e: any) {
      lastErr = e
      const is429 = e?.message?.includes('429') || e?.message?.includes('quota') || e?.message?.includes('RESOURCE_EXHAUSTED')
      if (!is429) throw e
      console.warn(`[AI] ${modelName} quota, trying next...`)
      await new Promise(r => setTimeout(r, 800))
    }
  }
  throw lastErr
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (!['teacher','admin'].includes(profile?.role))
      return NextResponse.json({ error: 'ليس لديك صلاحية استخدام AI' }, { status: 403 })

    const formData = await req.formData()
    const mode    = formData.get('mode') as string
    const message = (formData.get('message') as string) || ''
    const history = JSON.parse((formData.get('history') as string) || '[]')
    const file    = formData.get('file') as File | null

    // ── وضع تحليل الملف ─────────────────────
    if (file) {
      const bytes  = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      const prompt = message || 'حلّل هذا الملف وقدّم ملخصاً شاملاً مع أبرز النقاط الطبية.'
      const text = await tryModels(m => m.generateContent([
        { inlineData: { data: base64, mimeType: file.type } },
        { text: prompt }
      ]).then((r: any) => r.response.text()))
      return NextResponse.json({ text })
    }

    // ── وضع توليد أسئلة MCQ ─────────────────
    if (mode === 'quiz') {
      const count  = formData.get('count') || '5'
      const prompt = `أنشئ ${count} أسئلة MCQ طبية عن: "${message}"
كل سؤال: 4 خيارات، إجابة صحيحة واحدة، تنوع في المستوى.
أجب بـ JSON فقط بدون أي نص خارجي:
[{"question":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_option":"option_a","explanation":"..."}]`
      const raw = await tryModels(m => m.generateContent(prompt).then((r: any) => r.response.text()))
      const clean = raw.replace(/```json\n?|\n?```/g,'').trim()
      try   { return NextResponse.json({ questions: JSON.parse(clean), text: raw }) }
      catch { return NextResponse.json({ text: raw }) }
    }

    // ── وضع المحادثة العادية ─────────────────
    const text = await tryModels(m => {
      const chat = m.startChat({
        history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
      })
      return chat.sendMessage(message).then((r: any) => r.response.text())
    })
    return NextResponse.json({ text })

  } catch (err: any) {
    console.error('[AI_ERROR]', err)
    const msg = err?.message || 'خطأ غير معروف'
    const is429 = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')
    return NextResponse.json({
      error: is429
        ? '⏳ تم استنفاد الحد المجاني مؤقتاً. يرجى الانتظار دقيقة والمحاولة مجدداً.'
        : `❌ ${msg}`
    }, { status: is429 ? 429 : 500 })
  }
}
