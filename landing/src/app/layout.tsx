import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'YODO — Найди своего специалиста',
  description: 'Платформа для поиска проверенных специалистов. Строительство, ремонт, дизайн и многое другое. Безопасные сделки и гарантия качества.',
  keywords: ['специалисты', 'услуги', 'ремонт', 'строительство', 'фриланс', 'мастера'],
  authors: [{ name: 'YODO' }],
  openGraph: {
    title: 'YODO — Найди своего специалиста',
    description: 'Платформа для поиска проверенных специалистов',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}




