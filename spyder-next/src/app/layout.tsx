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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
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
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1428",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-[#0a1428]`}>
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
              </TooltipProvider>
            </FavoritesProvider>
          </PipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
