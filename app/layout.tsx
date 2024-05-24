import '@/app/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
const FormWidget = dynamic(() => import('@/components/FormWidget'), {
    ssr: false
})
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
    title: {
        template: '%s | Laurier Flow',
        absolute: 'Laurier Flow',
        default: 'Laurier Flow'
    },
    description: 'The best way to plan your Laurier schedule'
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </head>
            <body className='flex h-screen flex-col bg-slate-50 text-foreground dark:bg-background'>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className='flex grow flex-col items-center justify-start'>
                        {children}
                    </main>
                    <FormWidget />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}