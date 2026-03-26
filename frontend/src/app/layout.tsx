import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aamin Ambulance - Emergency Dispatch System',
  description: 'Professional ambulance services and emergency medical response',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
