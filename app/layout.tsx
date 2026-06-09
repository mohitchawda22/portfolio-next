import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import { ConsentAwareAnalytics } from '@/components/ConsentAwareAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { SitePreloader } from '@/components/SitePreloader'
import { PRELOADER_INIT_SCRIPT } from '@/lib/preloader-theme'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeTransitionProvider } from '@/components/ThemeTransitionProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mohit Kumar - Frontend Developer',
  description: 'Created with Next.js 13, Tailwind CSS, and Framer Motion',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-preloader="active" data-preloader-lock>
      <body className="font-sans antialiased">
        <Script id="preloader-init" strategy="beforeInteractive">
          {PRELOADER_INIT_SCRIPT}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'system']}
        >
          <ThemeTransitionProvider>
            <SitePreloader
              revealStyle="center"
              counterDuration={3200}
              revealDuration={1400}
              speed={1}
              gridSize={46}
              minDisplayTime={700}
            >
              {children}
            </SitePreloader>
            <CookieConsent />
          </ThemeTransitionProvider>
        </ThemeProvider>
        <ConsentAwareAnalytics />
      </body>
    </html>
  )
}
