import Link from "next/link";
import { CAMS, CAM_BUSINESSES, CAMS_BY_BUSINESS } from "@/lib/cams";
import { JsonLd } from "@/components/JsonLd";
import { camListSchema, faqSchema } from "@/lib/seo";

/**
 * HomeSeoContent — server-rendered, crawlable content that lives BELOW the live
 * cam station (the hero + main purpose of the site). Gives Google and AI systems
 * (AI Overviews, Perplexity, ChatGPT Search, etc.) real, extractable text: a
 * clear H1, an answer-first intro, the full cam directory as internal links, and
 * an FAQ. None of this loads iframes, so it doesn't affect Core Web Vitals.
 */

const FAQ: { q: string; a: string }[] = [
  {
    q: "How many live cams does SpyderNetwork have at Lake of the Ozarks?",
    a: "SpyderNetwork streams 60+ free live webcams from Lake of the Ozarks, Missouri — the largest live cam network on the lake. Feeds cover bars and grills, marinas, pools, docks, live-music stages, and lakefront views.",
  },
  {
    q: "Is it free to watch Lake of the Ozarks live cams?",
    a: "Yes. Every live cam on SpyderNetwork is 100% free to watch, with no account and no signup, on any phone, tablet, computer, or smart TV.",
  },
  {
    q: "Which Lake of the Ozarks venues have live cams?",
    a: "Popular venues on SpyderNetwork include Backwater Jacks, Dog Days, Lazy Gators, Fish & Company, Encore Lakeside Grill, Franky & Louie's, and dozens more waterfront bars, marinas, and restaurants across the lake.",
  },
  {
    q: "What areas of Lake of the Ozarks are covered?",
    a: "Cams span the main channel and popular arms including the Bagnell Dam Strip, Lake Ozark, Osage Beach, Sunrise Beach, Camdenton, and Gravois Mills. Many cams are tagged by mile marker so you can find the exact spot on the water.",
  },
  {
    q: "Can I watch on my phone or cast the cams to a TV?",
    a: "Yes. SpyderNetwork is built mobile-first and every stream works on cellular from the boat or the dock. You can also cast any live cam to your TV to watch the lake on the big screen.",
  },
  {
    q: "How do I add my business's live cam to SpyderNetwork?",
    a: "Lake of the Ozarks businesses can join through the Become a Broadcaster program. Your cam appears in the live cam list, on the interactive lake map, and in front of the LOTO community — usually with less than an hour of setup.",
  },
];

export function HomeSeoContent() {
  return (
    <section className="border-t border-white/10 bg-spyder-navy" aria-labelledby="loto-cams-heading">
      <JsonLd data={[camListSchema(CAMS), faqSchema(FAQ)]} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ── Answer-first intro ── */}
        <h1 id="loto-cams-heading" className="font-display text-2xl sm:text-3xl font-bold text-white">
          Lake of the Ozarks Live Cams
        </h1>
        <p className="mt-3 max-w-3xl text-spyder-gray/90 leading-relaxed">
          <strong className="text-white">SpyderNetwork</strong> is the largest network of live webcams at{" "}
          <strong className="text-white">Lake of the Ozarks, Missouri</strong> — 60+ real-time streams from the
          lake&apos;s most popular bars, marinas, pools, docks, and live-music stages. Check conditions before you
          launch the boat, see which venue is packed tonight, or watch the sunset over the water — free, with no
          signup, on any device. Cams cover the <strong className="text-white">Bagnell Dam Strip</strong>,{" "}
          <strong className="text-white">Lake Ozark</strong>, <strong className="text-white">Osage Beach</strong>,{" "}
          <strong className="text-white">Sunrise Beach</strong>, and more, many tagged by mile marker.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/radar" className="text-spyder-teal hover:text-white transition-colors">
            Lake radar &amp; conditions →
          </Link>
          <Link href="/become-a-broadcaster" className="text-spyder-teal hover:text-white transition-colors">
            Add your business cam →
          </Link>
        </div>

        {/* ── Full cam directory (crawlable internal links) ── */}
        <h2 className="font-display text-xl font-bold text-white mt-12 mb-1">
          All live cams by venue
        </h2>
        <p className="text-spyder-gray/80 text-sm mb-6">
          Every SpyderNetwork live cam at Lake of the Ozarks — tap a venue to open its full-screen stream.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {CAM_BUSINESSES.map((biz) => {
            const cams = CAMS_BY_BUSINESS[biz] ?? [];
            if (!cams.length) return null;
            return (
              <div key={biz}>
                <h3 className="text-sm font-bold text-white mb-1.5">{biz}</h3>
                <ul className="space-y-1">
                  {cams.map((cam) => (
                    <li key={cam.id}>
                      <Link
                        href={`/cams/${cam.slug}`}
                        className="text-sm text-spyder-gray hover:text-spyder-teal transition-colors"
                      >
                        {cam.business} – {cam.name} Live Cam
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── FAQ (visible + FAQPage schema) ── */}
        <h2 className="font-display text-xl font-bold text-white mt-14 mb-6">
          Lake of the Ozarks live cams — FAQ
        </h2>
        <div className="space-y-6 max-w-3xl">
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-white font-semibold mb-1.5">{q}</h3>
              <p className="text-spyder-gray/90 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeSeoContent;
