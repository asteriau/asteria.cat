import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { PreloadProvider } from '@/components/PreloadProvider'
import Particles from '@/components/layout/Particles'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: "asteria.cat",
  description: 'meow meow meow meow meow meow',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    siteName: 'asteria.cat',
    type: 'website',
    url: '/',
    title: "asteria's website",
    description: 'meow meow meow meow meow meow',
    images: '/social-image.png',
  },
  twitter: {
    card: 'summary',
    site: '@asteriau',
    title: "asteria's website",
    description: 'meow meow meow meow meow meow',
    images: '/social-image.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8DA3B9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <PreloadProvider />
        <div className="fixed inset-0 z-0">
          <Particles
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleColors={["#8da3b9"]}
            alphaParticles
            particleBaseSize={100}
            sizeRandomness={1}
            cameraDistance={20}
            disableRotation
          />
        </div>
        <Navbar />
        <main>
          {children}
        </main>
        <MobileNav />
        <Footer />
      </body>
    </html>
  )
}
