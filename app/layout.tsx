import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Mon portfolio personnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${GeistSans.className} ${GeistSans.variable}`}>
        {children}
      </body>
    </html>
  )
} 