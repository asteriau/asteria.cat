import "./globals.css";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Figtree, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import { Conditional } from "@/components/shader/conditional";
import { Suspense } from "react";
import Gradient from "@/components/shader/gradient-importer";

export const metadata: Metadata = {
  title: "asteria.cat",
  description: "meow meow meow meow meow meow",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "asteria.cat",
    type: "website",
    url: "/",
    title: "asteria's website",
    description: "meow meow meow meow meow meow",
    images: "/social-image.png",
  },
  twitter: {
    card: "summary",
    site: "@asteriau",
    title: "asteria's website",
    description: "meow meow meow meow meow meow",
    images: "/social-image.png",
  },
};

export const viewport: Viewport = {
  themeColor: '#8DA3B9',
}

const mono = IBM_Plex_Mono({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});
const figtree = Figtree({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-figtree",
});
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const TopSpacer = () => (
  <div className="pt-12 md:pt-10 lg:pt-20 xl:pt-32 2xl:pt-40 transition-all duration-1000" />
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${figtree.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div className="dark:text-neutral-200 text-black transition-all h-screen overflow-x-hidden flex justify-center">
            <div
              className={`fixed left-0 top-0 w-screen h-screen bg-pink-100 dark:bg-neutral-900 transition-opacity duration-1000 -z-30`}
            />
            <Conditional
              paths={["/", "/projects", "/uses"]}
              defaultComponent={null}
            >
              <Suspense>
                <Gradient />
              </Suspense>
            </Conditional>
            <div className="px-4 py-5 mx-2 mb-8 sm:px-6 max-w-full max-h-full md:max-w-screen-xl">
              <Conditional
                paths={["/", "/projects"]}
                defaultComponent={
                  <div className="max-w-prose w-screen pt-10 transition-all duration-1000" />
                }
              >
                <TopSpacer />
              </Conditional>
              <Header />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
