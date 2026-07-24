import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Tv2, Wifi, Zap, Star,
  CheckCircle, MapPin, Radio, BarChart3, Shield, Users,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { SITE, absoluteUrl, pageMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Become a Broadcaster",
  description:
    "Put your Lake of the Ozarks business in front of thousands of daily visitors. List your live cam on SpyderNetwork — on the cam list, the lake map, and in the cam cycle.",
  path: "/become-a-broadcaster",
});

const TIERS = [
  {
    id: "basic", name: "On the Network",
    tagline: "Get your cam on the lake's biggest platform",
    Icon: Wifi, accent: "cyan" as const, highlight: false, badge: null as string | null,
    features: ["Live cam listed on SpyderNetwork","Interactive lake map pin","Link to your business website","Included in cam cycle rotation","Camera setup guidance & support","Access to our broadcast community"],
    cta: "Get Started", subject: "Become%20a%20Broadcaster%20-%20Basic",
  },
  {
    id: "featured", name: "Featured Partner",
    tagline: "Stand out — be the cam people seek first",
    Icon: Star, accent: "gold" as const, highlight: true, badge: "Most Popular" as string | null,
    features: ["Everything in Basic",'"Featured" badge on your cam listing',"Priority placement in the cam list","Logo & link on our Partners page","Highlighted pin on the lake map","Spotlighted in the cam cycle"],
    cta: "Become Featured", subject: "Become%20a%20Broadcaster%20-%20Featured",
  },
  {
    id: "premium", name: "Premium Broadcaster",
    tagline: "Maximum exposure across the entire lake network",
    Icon: Zap, accent: "purple" as const, highlight: false, badge: null as string | null,
    features: ["Everything in Featured",'"Premium" badge across the platform',"First position in cam cycle rotation","Homepage spotlight placement","Dedicated cam landing page","Monthly visibility report","Priority partner support"],
    cta: "Go Premium", subject: "Become%20a%20Broadcaster%20-%20Premium",
  },
];

const WHY = [
  { Icon: Users,     title: "Thousands of Eyes Daily",  desc: "Lake visitors, boaters, and fans check SpyderNetwork for real-time conditions and nightlife every single day." },
  { Icon: MapPin,    title: "On the Map — Literally",   desc: "Your location appears on our interactive lake map. Visitors see you before they even set out on the water." },
  { Icon: Radio,     title: "Mobile-First Audience",    desc: "Our audience checks cams from the boat, dock, and bar. Your stream rides in every pocket at the lake." },
  { Icon: BarChart3, title: "Real Visibility",          desc: "Live cams build trust. Viewers see your venue is open, packed, and worth the trip — no ad spend needed." },
];

const STEPS = [
  { num: "01", title: "Reach Out",    desc: "Tell us about your business and location. We will walk you through the options and find the right fit." },
  { num: "02", title: "Camera Setup", desc: "We guide you on compatible cameras and stream keys. Setup takes less than an hour for most venues." },
  { num: "03", title: "Go Live",      desc: "Your cam is live on SpyderNetwork, on the map, and in front of the LOTO community — instantly." },
];

const FAQ = [
  { q: "What equipment do I need?",        a: "Any IP camera or streaming device that supports RTMP output works — consumer IP cams, GoPros, or pro PTZ setups. We help you choose the right fit." },
  { q: "Is there a long-term contract?",   a: "No long-term commitments. We work month-to-month. Start, pause, or upgrade your tier at any time." },
  { q: "How quickly can I get live?",      a: "Most broadcasters are streaming within 24-48 hours of initial setup. Some go live the same afternoon they reached out." },
  { q: "Can I broadcast multiple cams?",   a: "Absolutely — many partners broadcast 3-5 cams: pool, stage, dock, and dining areas. Each cam gets its own listing." },
  { q: "What if my stream goes offline?",  a: "Your cam page shows a friendly offline message. We monitor stream health and reach out if we notice extended downtime." },
];

const IBORDER: Record<string, string> = { cyan: "border-spyder-cyan/30", gold: "border-spyder-gold/50", purple: "border-spyder-purple/30" };
const IBG:     Record<string, string> = { cyan: "rgba(0,212,255,0.07)", gold: "rgba(245,166,35,0.08)", purple: "rgba(168,85,247,0.07)" };
const IIBG:    Record<string, string> = { cyan: "rgba(0,212,255,0.12)", gold: "rgba(245,166,35,0.14)", purple: "rgba(168,85,247,0.12)" };
const ICLR:    Record<string, string> = { cyan: "#00d4ff", gold: "#f5a623", purple: "#a855f7" };
const CTABG:   Record<string, string> = {
  cyan:   "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.08))",
  gold:   "linear-gradient(135deg,#f5a623,#e08800)",
  purple: "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(168,85,247,0.08))",
};
const CTABDR:  Record<string, string> = { cyan: "1px solid rgba(0,212,255,0.4)", gold: "1px solid rgba(245,166,35,0.6)", purple: "1px solid rgba(168,85,247,0.4)" };
const CTACLR:  Record<string, string> = { cyan: "#00d4ff", gold: "#000", purple: "#a855f7" };

export default function BecomeABroadcasterPage() {
  return (
    <div className="min-h-screen bg-spyder-navy overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-14 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
            <g stroke="#00d4ff" strokeWidth="0.6" fill="none">
              {[60,120,180,240,300,360].map((r) => <circle key={r} cx="400" cy="200" r={r} />)}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return <line key={deg} x1="400" y1="200" x2={400+400*Math.cos(rad)} y2={200+400*Math.sin(rad)} />;
              })}
            </g>
          </svg>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(204,0,0,0.18) 0%,transparent 70%)" }} aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-spyder-gray hover:text-white transition-colors mb-8 min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
          <div className="inline-flex items-center gap-2 text-spyder-red text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-5" style={{ background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.25)" }}>
            <Tv2 className="w-3.5 h-3.5" /> For Lake of the Ozarks Businesses
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Broadcast Your Business<br />
            <span style={{ color: "#cc0000", textShadow: "0 0 30px rgba(204,0,0,0.5)" }}>to the Whole Lake.</span>
          </h1>
          <p className="text-spyder-gray text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            SpyderNetwork is where the lake comes alive. Get your bar, marina, pool, or dock streaming live to thousands of LOTO visitors — 24/7, from any device.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            {[{ value: "60+", label: "Live Cams" },{ value: "Daily", label: "Viewer Traffic" },{ value: "LOTO", label: "Coverage" }].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-spyder-red">{value}</p>
                <p className="text-xs text-spyder-gray uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <a href="mailto:roger@spydernetwork.com?subject=Become%20a%20Broadcaster" className="btn-primary text-base px-8 py-4 inline-flex">
            <Wifi className="w-5 h-5" /> Get Your Cam Live Today <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── Why SpyderNetwork ── */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-2">Why Broadcast on SpyderNetwork?</h2>
        <p className="text-spyder-gray text-sm text-center mb-10 max-w-lg mx-auto">The largest live-cam network at Lake of the Ozarks — and the only one your customers are already watching.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WHY.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 rounded-2xl" style={{ background: "rgba(13,21,38,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(204,0,0,0.14)", border: "1px solid rgba(204,0,0,0.2)" }}>
                <Icon className="w-5 h-5 text-spyder-red" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{title}</p>
                <p className="text-spyder-gray text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing Tiers ── */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-2">Choose Your Level</h2>
        <p className="text-spyder-gray text-sm text-center mb-10 max-w-md mx-auto">Every business starts with a live cam. How visible you want to be is up to you.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map(({ id, name, tagline, Icon, accent, highlight, badge, features, cta, subject }) => (
            <div key={id} className={`relative flex flex-col rounded-2xl p-6 border ${IBORDER[accent]}`} style={{ background: highlight ? IBG[accent] : "rgba(13,21,38,0.7)" }}>
              {highlight && badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full" style={{ background: "#f5a623", color: "#000" }}>{badge}</div>
              )}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: IIBG[accent] }}>
                <Icon className="w-6 h-6" style={{ color: ICLR[accent] }} />
              </div>
              <h3 className="font-display text-xl font-bold mb-1" style={{ color: ICLR[accent] }}>{name}</h3>
              <p className="text-spyder-gray text-sm mb-5 leading-snug">{tagline}</p>
              <ul className="flex-1 space-y-2.5 mb-7">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: ICLR[accent] }} />
                    <span className="text-spyder-gray leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <a href={`mailto:roger@spydernetwork.com?subject=${subject}`} className="w-full flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-xl min-h-[48px] transition-all active:scale-95 touch-manipulation" style={{ background: CTABG[accent], border: CTABDR[accent], color: CTACLR[accent] }}>
                {cta} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-spyder-gray/60 mt-6">All tiers start with a conversation — no upfront costs, no contracts.</p>
      </section>

      {/* ── How It Works ── */}
      <section className="py-14 px-4 sm:px-6" style={{ background: "linear-gradient(180deg,transparent,rgba(13,21,38,0.6),transparent)" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-10">Up and Running in 3 Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 font-display font-bold text-xl" style={{ background: "rgba(204,0,0,0.15)", border: "1px solid rgba(204,0,0,0.3)", color: "#cc0000" }}>{num}</div>
                <p className="font-semibold text-white text-base mb-1">{title}</p>
                <p className="text-spyder-gray text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 px-4 sm:px-6 max-w-3xl mx-auto">
        <JsonLd data={[
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "Home", url: SITE.url },
            { name: "Become a Broadcaster", url: absoluteUrl("/become-a-broadcaster") },
          ]),
        ]} />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-8">Common Questions</h2>
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-xl overflow-hidden" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-white text-sm min-h-[52px] list-none [&::-webkit-details-marker]:hidden hover:bg-white/[0.03] transition-colors">
                {q}
                <span className="text-spyder-red shrink-0 text-xl leading-none group-open:rotate-45 transition-transform duration-200" aria-hidden>+</span>
              </summary>
              <div className="px-5 pb-5">
                <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
                <p className="text-spyder-gray text-sm leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(204,0,0,0.2) 0%,rgba(10,14,26,0.95) 60%,rgba(168,85,247,0.1) 100%)", border: "1px solid rgba(204,0,0,0.25)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden>
            <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
              <g stroke="#cc0000" strokeWidth="0.5" fill="none">
                {[50,100,150,200,250].map((r) => <circle key={r} cx="300" cy="150" r={r} />)}
                {[0,45,90,135,180,225,270,315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return <line key={deg} x1="300" y1="150" x2={300+280*Math.cos(rad)} y2={150+280*Math.sin(rad)} />;
                })}
              </g>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(204,0,0,0.2)", border: "1px solid rgba(204,0,0,0.35)" }}>
              <Shield className="w-8 h-8 text-spyder-red" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Ready to Join the Network?</h2>
            <p className="text-spyder-gray text-base max-w-md mx-auto mb-8 leading-relaxed">No complicated setup. No long contracts. Just your business, live on the lake&apos;s most-watched cam network.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:roger@spydernetwork.com?subject=Become%20a%20Broadcaster" className="btn-primary text-base px-8 py-4 inline-flex">
                <Wifi className="w-5 h-5" /> Email Us to Get Started <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4">Use the Contact Form</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
