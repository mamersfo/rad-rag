import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Rad RAG',
  description: 'RAG app demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' data-theme='finalist'>
      <body className={raleway.className}>{children}</body>
    </html>
  )
}
