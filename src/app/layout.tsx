import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'منصة تعلّم | أفضل منصة تعليمية عربية',
  description: 'منصة تعليمية متكاملة تقدم أحدث الدورات في مختلف المجالات التقنية والعملية.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider>
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: 70 }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
