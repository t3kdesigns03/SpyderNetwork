import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { WaterRipple } from "@/components/water-ripple";
import { FireflyParticles } from "@/components/firefly-particles";
import { PipProvider } from "@/providers/pip-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { FavoritesProvider } from "@/providers/favorites-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingPip } from "@/components/floating-pip";
import { FloatingOrb } from "@/components/floating-orb";
import { AfterDarkWrapper } from "@/components/after-dark-wrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spydernetwork.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.webmanifest",
  title: {
    default: "Spyder Network | Lake of the Ozarks Live Cams",
    template: "%s | Spyder Network",
  },
  description:
    "The largest network of live cameras at the Lake of the Ozarks. Real-time views 24/7 from Backwater Jack's, Dog Days, Lazy Gators, and 50+ venues.",
  keywords: ["Lake of the Ozarks", "live cam", "Spyder Network", "LOTO", "Osage Beach", "Bagnell Dam"],
  openGraph: {
    title: "Spyder Network | Lake of the Ozarks Live Cams",
    description: "The largest network of live cameras at the Lake of the Ozarks. Real-time views 24/7.",
    type: "website",
    url: BASE_URL,
    siteName: "Spyder Network",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a1428",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-[100dvh] bg-background overflow-x-hidden`}>
        <ThemeProvider>
          <PipProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <WaterRipple />
                <AfterDarkWrapper />
                <div className="relative z-10">
                  <Navbar />
                  <main>{children}</main>
                </div>
                <FloatingPip />
                <FloatingOrb />
                <Toaster position="bottom-center" richColors closeButton theme="dark" />
              </TooltipProvider>
            </FavoritesProvider>
          </PipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
