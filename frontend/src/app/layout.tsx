import type { Metadata } from 'next'
import { ReactQueryProvider } from '@/lib/react-query'
import './globals.scss'
import styles from './layout.module.scss'
import StoreProvider from '@/providers/StoreProvider'
import { AuthProvider } from '@/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'Chat-App',
  description: 'Fullstack application template with Next.js, Nest.js and PostgreSQL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={styles.body}>
        
        <StoreProvider>
          <AuthProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </AuthProvider>
        </StoreProvider >
        
      </body>
    </html>
  )
}