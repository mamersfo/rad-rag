import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
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
      <body className={raleway.className}>
        <div className='p-4'>{children}</div>
      </body>
    </html>
  )
}
