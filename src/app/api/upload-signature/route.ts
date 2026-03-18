import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (!profile || !['teacher','admin'].includes(profile.role))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const timestamp = Math.round(Date.now() / 1000)
    const folder    = `mansh/courses/${session.user.id}`

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, resource_type: 'video' },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature, timestamp, folder,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey:    process.env.CLOUDINARY_API_KEY,
    })
  } catch (err) {
    console.error('[SIGN_UPLOAD]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
