import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: { default:'منصة تعلّم الطبية', template:'%s | منصة تعلّم الطبية' },
  description: 'منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين.',
  keywords: ['تعليم طبي','دورات طبية','طب','صيدلة','تمريض'],
  openGraph: {
    title:       'منصة تعلّم الطبية',
    description: 'دورات طبية متخصصة بأسلوب واضح وعلمي دقيق',
    locale:      'ar_SA',
    type:        'website',
    siteName:    'منصة تعلّم الطبية',
  },
  robots: { index:true, follow:true },
  authors: [{ name:'منصة تعلّم الطبية' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <div style={{paddingTop:60}}>{children}</div>

          {/* زر الدعم الفني عبر تيليجرام */}
          <a
            href="https://t.me/moherd787"
            target="_blank"
            rel="noopener noreferrer"
            className="tg-support"
            title="تواصل مع الدعم الفني"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </ThemeProvider>
      </body>
    </html>
  )
}
