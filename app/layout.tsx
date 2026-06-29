import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

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
        <NavBar />
        {/* pt-14 = navbar height */}
        <main id="main" className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
