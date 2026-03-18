import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const seed    = Math.floor(Math.random() * 999999)
    const encoded = encodeURIComponent(`medical educational illustration: ${prompt}, professional diagram, clean white background, scientific style, high detail`)
    
    // نجرب عدة خدمات مجانية
    const sources = [
      // Pollinations.ai - مجاني
      `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true&seed=${seed}&model=flux`,
      // Backup: صورة من Picsum (placeholder) مع نص
      null,
    ]

    // نجرب Pollinations أولاً مع timeout 25 ثانية
    try {
      const res = await fetch(sources[0], {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MedicalEduBot/1.0)',
          'Accept':     'image/*',
          'Referer':    'https://mansh-eta.vercel.app',
        },
        signal: AbortSignal.timeout(25000),
      })

      if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
        const buffer = await res.arrayBuffer()
        return new Response(buffer, {
          headers: {
            'Content-Type':  res.headers.get('content-type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    } catch (e) {
      console.warn('[IMG] Pollinations failed:', e)
    }

    // Fallback: أعد URL مباشر للمتصفح ليحمّله
    return NextResponse.json({
      url:      sources[0],
      fallback: true,
      message:  'جاري تحميل الصورة مباشرة...'
    })

  } catch (err: any) {
    console.error('[AI_IMAGE]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
