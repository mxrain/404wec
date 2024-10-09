import './globals.css'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Backend',
  description: 'A powerful admin backend system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}