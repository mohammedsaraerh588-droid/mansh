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

export async function POST(req: Request) {
  try {
    // تحقق من صلاحيات المعلم
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', session.user.id).single()
    if (!['teacher','admin'].includes(profile?.role))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData = await req.formData()
    const mode     = formData.get('mode') as string      // 'chat' | 'file' | 'quiz'
    const message  = formData.get('message') as string
    const history  = JSON.parse((formData.get('history') as string) || '[]')
    const file     = formData.get('file') as File | null

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: SAFETY,
      systemInstruction: `أنت مساعد تعليمي طبي متخصص للمعلمين على منصة تعلّم الطبية. 
مهمتك مساعدة المعلمين في:
- إعداد المحتوى التعليمي الطبي
- شرح المفاهيم الطبية بأسلوب واضح
- إنشاء أسئلة MCQ للاختبارات
- تحليل الملفات والوثائق الطبية
- اقتراح خطط دراسية
أجب دائماً باللغة العربية بأسلوب علمي واضح ومنظم.`,
    })

    // وضع المحادثة العادية
    if (mode === 'chat' && !file) {
      const chat = model.startChat({
        history: history.map((h: any) => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      })
      const result = await chat.sendMessage(message)
      return NextResponse.json({ text: result.response.text() })
    }

    // وضع تحليل الملف
    if (file) {
      const bytes  = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      const mime   = file.type

      const prompt = message || 'حلّل هذا الملف وقدّم ملخصاً شاملاً مع أبرز النقاط الطبية.'

      const result = await model.generateContent([
        { inlineData: { data: base64, mimeType: mime } },
        { text: prompt }
      ])
      return NextResponse.json({ text: result.response.text() })
    }

    // وضع توليد الأسئلة
    if (mode === 'quiz') {
      const prompt = `أنشئ ${formData.get('count') || 5} أسئلة MCQ طبية حول الموضوع التالي:
"${message}"

الشروط:
- كل سؤال له 4 خيارات (أ، ب، ج، د)
- الخيار الصحيح واحد فقط
- أسئلة متنوعة تختبر الفهم والتطبيق
- مناسبة لطلاب الطب

أجب بصيغة JSON فقط بدون أي نص إضافي:
[
  {
    "question": "نص السؤال",
    "option_a": "الخيار أ",
    "option_b": "الخيار ب", 
    "option_c": "الخيار ج",
    "option_d": "الخيار د",
    "correct_option": "option_a",
    "explanation": "شرح الإجابة الصحيحة"
  }
]`
      const result = await model.generateContent(prompt)
      const text   = result.response.text().replace(/```json\n?|\n?```/g, '').trim()
      try {
        const questions = JSON.parse(text)
        return NextResponse.json({ questions, text })
      } catch {
        return NextResponse.json({ text })
      }
    }

    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  } catch (err: any) {
    console.error('[AI_ERROR]', err)
    return NextResponse.json({ error: err.message || 'AI error' }, { status: 500 })
  }
}
