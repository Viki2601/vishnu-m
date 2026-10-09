import { Caveat, Space_Mono, Reenie_Beanie } from "next/font/google";
import "./globals.css";

//  Font loading 
// Primary display / heading font — chunky handwriting
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Monospace labels / code / metadata
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

// Extra-scrawly handwriting for sticky note body text
const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  variable: "--font-reenie",
  display: "swap",
  weight: ["400"],
});

//  Metadata 
export const metadata = {
  metadataBase: new URL("https://viki.dev"),
  title: { default: "Viki — Frontend Developer", template: "%s | Viki", },
  description: 'Vishnu "Viki" Muthukumar — Frontend Developer & UI Builder from Chennai, India. ' + "Building pixel-polished, highly animated web experiences with Next.js, GSAP & React.",
  keywords: ["Frontend Developer", "UI Developer", "React", "Next.js", "GSAP", "Animation", "Chennai", "India", "Vishnu", "Viki",],
  authors: [{ name: "Vishnu", url: "https://viki.dev" }],
  creator: "Vishnu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://viki.dev",
    siteName: "Viki Portfolio",
    title: "Viki — Frontend Developer & Motion Nerd",
    description: 'Pixel-polished, highly animated portfolio of Vishnu "Viki" Muthukumar.',
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Viki Portfolio — Frontend Developer", },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viki — Frontend Developer & Motion Nerd",
    description: 'Pixel-polished, highly animated portfolio of Vishnu "Viki" Muthukumar.',
    images: ["/og-image.png"],
    creator: "@viki_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

//  Client providers + chrome 
// These are 'use client' components, imported here (server-safe leaf imports).
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/layout/MobileHeader";
import Dock from "@/components/layout/Dock";
import Cursor from "@/components/layout/Cursor";
import CursorDotHighlight from "@/components/layout/CursorDotHighlight";
import { ToastProvider } from "@/components/ui/Toast";
import AppShell from "./AppShell";

export default function RootLayout({ children }) {
  const fontVars = [caveat.variable, spaceMono.variable, reenieBeanie.variable,].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body className="bg-canvas text-chalk">
        <ToastProvider>
          <SmoothScrollProvider>
            {/* App shell handles Loader + page transition */}
            <AppShell>
              {/* Dot-grid background — base white dots */}
              <div className="fixed inset-0 bg-dots pointer-events-none" style={{ opacity: 0.35, zIndex: 0 }} aria-hidden="true" />
              {/* Red dot spotlight — follows cursor */}
              <CursorDotHighlight />
              {/* Layout: sidebar + main */}
              <div className="relative flex min-h-screen" style={{ zIndex: 1 }}>
                <Sidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <MobileHeader />
                  <main id="main-content" className="main-canvas flex-1">
                    {children}
                  </main>
                </div>
              </div>
            </AppShell>
            {/* Floating chrome */}
            <Dock />
            <Cursor />
          </SmoothScrollProvider>
        </ToastProvider>

        {/* JSON-LD Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vishnu Muthukumar",
              alternateName: "Viki",
              url: "https://viki.dev",
              jobTitle: "Frontend Developer",
              worksFor: {
                "@type": "Organization",
                name: "MAI Corporation",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Chennai",
                addressRegion: "Tamil Nadu",
                addressCountry: "IN",
              },
              sameAs: [
                "https://linkedin.com/in/vishnumuthukumar",
                "https://github.com/vishnumuthukumar",
                "https://twitter.com/viki_dev",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}