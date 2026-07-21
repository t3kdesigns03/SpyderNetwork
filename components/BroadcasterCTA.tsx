import Link from "next/link";
import { Tv2, Wifi, DollarSign, Users, ArrowRight } from "lucide-react";

const PERKS = [
  {
    icon: Users,
    title: "Massive Reach",
    desc: "Tap into Lake of the Ozarks' largest live-cam audience.",
  },
  {
    icon: Wifi,
    title: "Easy Setup",
    desc: "We handle the tech. Just point a camera and go live.",
  },
  {
    icon: DollarSign,
    title: "Drive Traffic",
    desc: "Bring real-time visibility to your bar, marina, or dock.",
  },
];

export function BroadcasterCTA() {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-spyder-red-dark via-spyder-red to-spyder-red-bright p-6 sm:p-10">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              <Tv2 className="w-3.5 h-3.5" />
              For Businesses
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Put Your Venue
              <br />
              On The Map
            </h2>
            <p className="text-white/80 text-base max-w-md mx-auto lg:mx-0 mb-6">
              Join the SpyderNetwork. Broadcast your bar, marina, pool, or dock live
              to thousands of Lake of the Ozarks fans — 24/7.
            </p>
            <Link
              href="/become-a-broadcaster"
              className="inline-flex items-center gap-2 bg-white text-spyder-red font-bold
                         px-8 py-4 rounded-xl text-base transition-all duration-200
                         hover:bg-spyder-navy hover:text-white active:scale-95 min-h-[52px]"
            >
              Become a Broadcaster
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Perks */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-72">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
