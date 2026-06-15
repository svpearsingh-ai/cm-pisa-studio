// app/layout.tsx
import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CM PISA Studio',
  description: 'ระบบผู้ช่วยครูสร้างข้อสอบและแผนการจัดการเรียนรู้ตามแนว PISA',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} font-sarabun antialiased`}>
        {children}
      </body>
    </html>
  )
}
