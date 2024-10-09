import { redirect } from 'next/navigation'

import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export default function SysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-10 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}