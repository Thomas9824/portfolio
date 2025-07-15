import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import './globals.css'

const offBit101 = localFont({
  src: '../public/fonts/OffBitTrial-101.otf',
  variable: '--font-offbit-101',
  display: 'swap',
})

const offBit101Bold = localFont({
  src: '../public/fonts/OffBitTrial-101Bold.otf',
  variable: '--font-offbit-101-bold',
  display: 'swap',
})

const offBitBold = localFont({
  src: '../public/fonts/OffBitTrial-Bold.otf',
  variable: '--font-offbit-bold',
  display: 'swap',
})

const offBitDot = localFont({
  src: '../public/fonts/OffBitTrial-Dot.otf',
  variable: '--font-offbit-dot',
  display: 'swap',
})

const offBitDotBold = localFont({
  src: '../public/fonts/OffBitTrial-DotBold.otf',
  variable: '--font-offbit-dot-bold',
  display: 'swap',
})

const offBitRegular = localFont({
  src: '../public/fonts/OffBitTrial-Regular.otf',
  variable: '--font-offbit-regular',
  display: 'swap',
})

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
      <body className={`${GeistSans.className} ${GeistSans.variable} ${offBit101.variable} ${offBit101Bold.variable} ${offBitBold.variable} ${offBitDot.variable} ${offBitDotBold.variable} ${offBitRegular.variable}`}>
        {children}
      </body>
    </html>
  )
} 