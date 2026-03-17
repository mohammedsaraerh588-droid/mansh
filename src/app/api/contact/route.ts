import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()

    // Validate input
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صحيحة' },
        { status: 400 }
      )
    }

    // Send email to admin
    const adminEmail = 'support@mansh-platform.com'
    
    const emailResponse = await resend.emails.send({
      from: 'contact@mansh-platform.com',
      to: adminEmail,
      replyTo: body.email,
      subject: `رسالة اتصال جديدة: ${body.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>رسالة اتصال جديدة من منصة تعلّم</h2>
          <p><strong>الاسم:</strong> ${body.name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${body.email}</p>
          <p><strong>الموضوع:</strong> ${body.subject}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <h3>الرسالة:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${body.message}</p>
        </div>
      `,
    })

    if (!emailResponse.data?.id) {
      throw new Error('فشل إرسال البريد الإلكتروني')
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: 'contact@mansh-platform.com',
      to: body.email,
      subject: 'تم استقبال رسالتك - منصة تعلّم',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>شكراً لتواصلك معنا</h2>
          <p>السلام عليكم ورحمة الله وبركاته،</p>
          <p>تم استقبال رسالتك بنجاح. سنقوم بمراجعتها والرد عليك في أقرب وقت ممكن.</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p><strong>تفاصيل رسالتك:</strong></p>
          <p><strong>الموضوع:</strong> ${body.subject}</p>
          <p><strong>تاريخ الاستقبال:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p>شكراً لاختيارك منصة تعلّم!</p>
          <p>فريق منصة تعلّم</p>
        </div>
      `,
    })

    return NextResponse.json(
      { 
        success: true,
        message: 'تم إرسال رسالتك بنجاح'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الرسالة' },
      { status: 500 }
    )
  }
}
