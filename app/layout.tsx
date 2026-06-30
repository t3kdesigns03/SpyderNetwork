import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

// Build once at module load — no JSX interpolation needed inside Script children
const GA_INIT_SCRIPT = GA_ID
  ? "window.dataLayer=window.dataLayer||[];" +
    "function gtag(){dataLayer.push(arguments);}" +
    "gtag('js',new Date());" +
    "gtag('config','" + GA_ID + "',{send_page_view:true,anonymize_ip:true});"
  : "";

export const metadata: Metadata = {
  title: {
    default: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
    template: "%s | SpyderNetwork",
  },
  description:
    "The largest network of live webcams at Lake of the Ozarks. Watch 60+ real-time feeds from bars, marinas, pools, and docks — free on any device.",
  keywords: [
    "Lake of the Ozarks", "live cams", "webcams", "LOTO", "SpyderNetwork",
    "Spyder Network", "live stream", "lake cams", "Dog Days", "Lazy Gators",
    "Fish and Company", "Backwater Jacks",
  ],
  authors: [{ name: "SpyderNetwork" }],
  creator: "SpyderNetwork",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spydernetwork.com",
    siteName: "SpyderNetwork",
    title: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
    description: "The largest network of live webcams at Lake of the Ozarks. Watch 60+ live streams free.",
    // og:image is auto-generated from app/opengraph-image.tsx (1200×630)
  },
  twitter: {
    card: "summary_large_image",
    title: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
    description: "Watch 60+ live streams from Lake of the Ozarks.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-spyder-navy text-white overflow-x-hidden">

        {GA_ID && (
          <>
            <Script
              src={"https://www.googletagmanager.com/gtag/js?id=" + GA_ID}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {GA_INIT_SCRIPT}
            </Script>
          </>
        )}

        <NavBar />
        {/* pt-14 = navbar height */}
        <main id="main" className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
