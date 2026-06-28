import Link from "next/link";
import { Wifi, Map, Video, Thermometer, Radio, Phone, Tv2, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-spyder-black border-t border-white/10 pt-10 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-spyder-red rounded-lg flex items-center justify-center">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm tracking-wide">SPYDER</p>
                <p className="font-display font-medium text-spyder-red text-[9px] tracking-[0.2em]">NETWORK</p>
              </div>
            </div>
            <p className="text-spyder-gray text-sm leading-relaxed max-w-xs">
              The largest network of live webcams at Lake of the Ozarks.
              Watch 60+ streams from bars, marinas, docks &amp; pools — free, on any device.
            </p>
            <p className="text-xs text-spyder-gray/50 mt-3">
              Featured on <em>Ozark Law</em> (TV Series)
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/#cams", label: "Live Cams", icon: Video },
                { href: "/#map", label: "Map", icon: Map },
                { href: "/#conditions", label: "Lake Conditions", icon: Thermometer },
                { href: "/radar", label: "Radar", icon: Radio },
                { href: "/video-collection", label: "Saved Videos", icon: BookOpen },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[32px]"
                >
                  <Icon className="w-3.5 h-3.5 text-spyder-red" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Business</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/become-a-broadcaster", label: "Become a Broadcaster", icon: Tv2 },
                { href: "/about-us", label: "About Us", icon: Wifi },
                { href: "/contact", label: "Contact", icon: Phone },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[32px]"
                >
                  <Icon className="w-3.5 h-3.5 text-spyder-red" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connection tip */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tips</h3>
            <div className="text-sm text-spyder-gray leading-relaxed space-y-2">
              <p>
                📶 Live cam feeds require a high-speed internet connection.
              </p>
              <p>
                ⚡ On cellular? Toggle <strong className="text-white">Airplane mode</strong> off/on
                to connect to the nearest tower.
              </p>
              <p>
                📡 On WiFi? Move closer to the router for best performance.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-spyder-gray/60">
          <p>© {new Date().getFullYear()} SpyderNetwork. All rights reserved.</p>
          <p>Lake of the Ozarks, Missouri</p>
        </div>
      </div>
    </footer>
  );
}
