import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Tv2, Wifi, DollarSign, Users, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Broadcaster",
  description:
    "Join SpyderNetwork and broadcast your Lake of the Ozarks business live to thousands of viewers. Easy setup, massive reach.",
};

const STEPS = [
  {
    num: "01",
    title: "Reach Out",
    desc: "Contact us to discuss your location and camera placement.",
  },
  {
    num: "02",
    title: "Camera Setup",
    desc: "We provide guidance on compatible cameras and streaming hardware.",
  },
  {
    num: "03",
    title: "Go Live",
    desc: "Your cam goes live on SpyderNetwork and reaches the LOTO community instantly.",
  },
];

const BENEFITS = [
  "Free exposure to thousands of Lake of the Ozarks visitors daily",
  "Increase foot traffic and brand awareness",
  "Featured on mobile-optimized platform — viewers check from their boats",
  "Listed on our interactive lake map",
  "Included in cam cycle feature for maximum visibility",
  "Your website linked from your cam page",
];

export default function BecomeABroadcasterPage() {
  return (
    <div className="min-h-screen pt-14 sm:pt-16 px-4 sm:px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="pt-8 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-spyder-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-red-glow">
            <Tv2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Become a Broadcaster
          </h1>
          <p className="text-spyder-gray text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Put your Lake of the Ozarks business in front of thousands of visitors
            with a live cam on SpyderNetwork.
          </p>
        </div>

        {/* How it works */}
        <div className="glass-panel p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-spyder-red/20 border border-spyder-red/30 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-spyder-red font-bold text-sm">{num}</span>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-spyder-gray text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="glass-panel p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-white mb-4">Benefits</h2>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-spyder-gray">
                <CheckCircle className="w-4 h-4 text-spyder-red shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="mailto:info@spydernetwork.com?subject=Become%20a%20Broadcaster"
            className="btn-primary text-base px-10 py-4 inline-flex"
          >
            <Wifi className="w-5 h-5" />
            Contact Us to Get Started
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-xs text-spyder-gray mt-4">
            Or use the{" "}
            <Link href="/contact" className="text-spyder-red hover:underline">
              contact form
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
