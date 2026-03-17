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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
