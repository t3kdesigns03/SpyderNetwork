export interface LakeEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  description: string;
  featuredCamId?: string;
  type: "concert" | "festival" | "fireworks" | "pub-crawl" | "shootout" | "other";
}

export const lakeEvents2026: LakeEvent[] = [
  { id: "aquapalooza-2026", title: "Aquapalooza 2026", date: new Date("2026-07-18"), location: "Lake of the Ozarks", description: "The world's largest boating party. Thousands of boats gather for live music and fun.", featuredCamId: "backwater-jacks-stage", type: "festival" },
  { id: "shootout-2026", title: "Lake of the Ozarks Shootout", date: new Date("2026-08-22"), endDate: new Date("2026-08-23"), location: "Captain Ron's / 33MM", description: "The largest unsanctioned boat race in the US. High-speed powerboat racing.", featuredCamId: "dog-days-dock", type: "shootout" },
  { id: "lazy-gators-july", title: "Lazy Gators Summer Concert", date: new Date("2026-07-04"), location: "Lazy Gators", description: "Fourth of July concert and fireworks at Lazy Gators.", featuredCamId: "lazy-gators-stage", type: "concert" },
  { id: "pub-crawl-tonight", title: "Lazy Gators Pub Crawl", date: new Date("2026-03-17"), location: "Various Venues", description: "Tonight's pub crawl across Lake hotspots.", featuredCamId: "backwater-jacks-stage", type: "pub-crawl" },
  { id: "dog-days-fireworks", title: "Dog Days Fireworks", date: new Date("2026-07-04"), location: "Dog Days", description: "Independence Day fireworks over the lake.", featuredCamId: "dog-days-pool", type: "fireworks" },
  { id: "backwater-concert", title: "Backwater Jack's Live Music", date: new Date("2026-06-14"), location: "Backwater Jack's", description: "Weekend live music on the stage.", featuredCamId: "backwater-jacks-stage", type: "concert" },
  { id: "neon-taco-summer", title: "Neon Taco Summer Series", date: new Date("2026-06-21"), location: "Neon Taco", description: "Summer concert series at Neon Taco.", featuredCamId: "neon-taco-stage", type: "concert" },
  { id: "encore-sky-bar", title: "Encore Sky Bar Night", date: new Date("2026-08-08"), location: "Encore Lakeside Grill", description: "Sky Bar stage night with lake views.", featuredCamId: "encore", type: "concert" },
];
