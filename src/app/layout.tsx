import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { LightRays } from '@/components/layout/LightRays'
import { PreloadProvider } from '@/components/PreloadProvider'

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
				<LightRays raysOrigin="top-center" raysColor="#8DA3B9" />
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
