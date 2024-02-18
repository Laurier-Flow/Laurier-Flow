import '@/app/globals.css'
import React from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Laurier Flow',
  description: 'The best way to plan your Laurier schedule'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang='en'>
      <body className='bg-background text-foreground w-screen h-screen flex flex-col'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className='flex w-screen flex-grow'>
            {children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
