import Link from "next/link";
import { ExternalLink } from "lucide-react";

const SPONSORS: { name: string; url: string }[] = [
  { name: "Alhonna Resort & Marina", url: "https://thealhonnaresort.com/" },
  { name: "Alley Cats", url: "https://www.alleycatsonthestrip.com/" },
  { name: "Angels Mexican Restaurant", url: "https://www.facebook.com/profile.php?id=61577060969567" },
  { name: "Annamarie Hopkins Real Estate", url: "https://asmartermove.com/" },
  { name: "Backwater Jacks", url: "https://backwaterjacks.com/" },
  { name: "Bridgeview Marina", url: "https://www.facebook.com/pages/Bridgeview%20Marina/157000694367289/" },
  { name: "Camdenton Glass", url: "https://camdentonglass.com/" },
  { name: "Dock Glide", url: "https://dockglide.com" },
  { name: "Dog Days", url: "https://dogdays.ws/" },
  { name: "Dogwood Animal Shelter", url: "https://www.daslakeoftheozarks.com/" },
  { name: "Encore Lakeside Grill", url: "https://theencoregrill.com/" },
  { name: "Fish and Company", url: "https://thefishandcompany.com/" },
  { name: "JB Hooks", url: "https://www.jbhooks.com/" },
  { name: "KRMS Radio", url: "https://www.krmsradio.com/" },
  { name: "Lake Billiards Sports Bar & Grill", url: "https://lakebilliards.com/" },
  { name: "Lazy Gators", url: "https://lazygators.com/" },
  { name: "Marty Byrde's", url: "https://martybyrde.com/" },
  { name: "Michael's Steak Chalet", url: "https://steakchalet.com/" },
  { name: "Neon Taco", url: "https://www.theneontaco.com/" },
  { name: "Paradise", url: "https://www.paradiseatthelake.com/" },
  { name: "Tucker's Shuckers", url: "https://tuckersshuckers.com/" },
  { name: "Wicked Willie's", url: "https://wickedwilliessportsgrill.com/" },
];

export function SponsorList() {
  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <h2 className="section-heading mb-2">
        Our <span className="text-spyder-red">Sponsors</span>
      </h2>
      <p className="text-spyder-gray text-sm mb-6">
        Visit these local Lake of the Ozarks businesses.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {SPONSORS.map(({ name, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-3 py-3
                       rounded-xl bg-white/5 border border-white/10 min-h-[52px]
                       hover:bg-white/10 hover:border-white/20 hover:text-white
                       transition-all duration-200 touch-manipulation group"
          >
            <span className="text-sm text-spyder-gray group-hover:text-white transition-colors leading-tight">
              {name}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-spyder-gray/50 group-hover:text-spyder-red shrink-0 transition-colors" />
          </a>
        ))}
      </div>

      <p className="text-xs text-spyder-gray/50 mt-6 text-center">
        Disclaimer: Any concerns regarding external links should be directed to the respective site administrator.
        All cams are in a public setting. Please use discretion when viewing.
      </p>
    </section>
  );
}
