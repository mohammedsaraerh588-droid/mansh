import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: { default:'منصة تعلّم الطبية', template:'%s | منصة تعلّم الطبية' },
  description: 'منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين — دورات علمية دقيقة وشهادات إتمام معتمدة.',
  keywords: ['تعليم طبي','دورات طبية','طب','صيدلة','تمريض','تشريح','فسيولوجيا','باثولوجيا'],
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
          <main style={{ minHeight: '100vh', paddingTop: 56 }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
