import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeVault - AI Website Builder',
  description: 'Build any website with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-black via-codevault-dark-gray to-black">
            {children}
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111',
                color: '#00ff00',
                border: '1px solid #00ff00',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
