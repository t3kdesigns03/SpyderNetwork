import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { JsonLd } from "@/components/JsonLd";
import { SITE, organizationSchema, websiteSchema } from "@/lib/seo";

// GA4 Measurement ID. Env var is the source of truth (set in Netlify); the
// hardcoded fallback is the current production property so analytics keeps
// firing through the domain cutover even if the env var is ever unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-HBGQRN6Y5N";

// Build once at module load — no JSX interpolation needed inside Script children
const GA_INIT_SCRIPT = GA_ID
  ? "window.dataLayer=window.dataLayer||[];" +
    "function gtag(){dataLayer.push(arguments);}" +
    "gtag('js',new Date());" +
    "gtag('config','" + GA_ID + "',{send_page_view:true,anonymize_ip:true});"
  : "";

// Canonical production domain — single source of truth lives in lib/seo.ts so
// metadata, canonicals, sitemap, robots, OG URLs, and schema never drift.
const SITE_URL = SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  applicationName: "SpyderNetwork",
  manifest: "/site.webmanifest",
  // iOS "Add to Home Screen" behavior: standalone launch, short home-screen
  // label, and a dark status bar that matches the app's theme.
  appleWebApp: {
    capable: true,
    title: "SpyderNetwork",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SpyderNetwork",
    title: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
    description: "The largest network of live webcams at Lake of the Ozarks. Watch 60+ live streams free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@spyder_network",
    creator: "@spyder_network",
    title: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
    description: "Watch 60+ live streams from Lake of the Ozarks.",
    images: [
      {
        url: "/og-image.png",
        alt: "SpyderNetwork – Live Lake of the Ozarks Web Cams",
      },
    ],
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

        {/* Site-wide structured data: Organization + WebSite */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

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
