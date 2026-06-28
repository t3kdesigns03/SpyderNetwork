import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SpyderNetwork — Lake of the Ozarks live cam network.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-14 sm:pt-16 px-4 sm:px-6 pb-16">
      <div className="max-w-xl mx-auto">
        <div className="pt-8 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-spyder-gray hover:text-white transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Contact Us
        </h1>
        <p className="text-spyder-gray mb-8">Questions? Want to add your cam? Reach out.</p>

        <div className="glass-panel p-6 mb-6 space-y-4">
          <div className="flex items-center gap-3 text-sm text-spyder-gray">
            <Mail className="w-5 h-5 text-spyder-red shrink-0" />
            <a href="mailto:info@spydernetwork.com" className="hover:text-white transition-colors">
              info@spydernetwork.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-spyder-gray">
            <MapPin className="w-5 h-5 text-spyder-red shrink-0" />
            Lake of the Ozarks, Missouri
          </div>
        </div>

        {/* Simple contact form */}
        <form
          action="mailto:info@spydernetwork.com"
          method="get"
          encType="text/plain"
          className="glass-panel p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-1.5" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                         placeholder:text-spyder-gray focus:outline-none focus:border-spyder-red/60
                         transition-all min-h-[48px] text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                         placeholder:text-spyder-gray focus:outline-none focus:border-spyder-red/60
                         transition-all min-h-[48px] text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us about your cam location or question…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                         placeholder:text-spyder-gray focus:outline-none focus:border-spyder-red/60
                         transition-all resize-none text-base"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-base py-4">
            <Mail className="w-5 h-5" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
