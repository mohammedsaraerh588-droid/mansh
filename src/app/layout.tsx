import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnimatedLayout from '@/components/layout/AnimatedLayout'

export const metadata: Metadata = {
  title: { default:'منصة تعلّم الطبية', template:'%s | منصة تعلّم الطبية' },
  description: 'منصة تعليمية طبية متخصصة لطلاب الطب والمتخصصين الصحيين — دورات علمية دقيقة وشهادات إتمام معتمدة.',
  keywords: ['تعليم طبي','دورات طبية','طب','صيدلة','تمريض','تشريح','فسيولوجيا','باثولوجيا'],
  openGraph: {
    title:       'منصة تعلّم الطبية',
    description:   'دورات طبية متخصصة بأسلوب واضح وعلمي دقيق',
    locale:      'ar_SA',
    type:        'website',
    siteName:    'منصة تعلّم الطبية',
  },
  robots: { index:true, follow:true },
  authors: [{ name:'منصة تعلّم الطبية' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      </head>
      <body className="bg-bg-primary text-text-primary overflow-x-hidden dark">
        <ThemeProvider>
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

