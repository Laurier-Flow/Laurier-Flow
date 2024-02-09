import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ModeToggle } from '@/components/ModeToggle'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </ThemeProvider>
      </body>
    </html>
  )
}
