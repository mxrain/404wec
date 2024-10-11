import './globals.css'
import { Inter } from 'next/font/google'  // 这是谷歌字体
import { Providers } from './components/Providers';

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
    <html lang="zh-CN">
      <body className={inter.className}>  {/* 这是字体 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}