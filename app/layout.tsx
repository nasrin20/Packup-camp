import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PackUp — Find your camping crew',
  description: 'Connect with other Australians who love camping. Find a crew, post a trip, explore the outdoors together.',
  manifest: '/manifest.json',
  themeColor: '#0f1a0e',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PackUp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-forest-900 text-forest-100 antialiased">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
              })
            }
          `
        }} />
      </body>
    </html>
  )
}