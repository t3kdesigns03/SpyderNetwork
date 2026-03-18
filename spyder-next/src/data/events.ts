export interface LakeEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  description: string;
  featuredCamId?: string;
  type: "concert" | "festival" | "fireworks" | "live-music" | "shootout" | "other";
}

export const lakeEvents2026: LakeEvent[] = [
  {
    id: "aquapalooza-2026",
    title: "Aquapalooza 2026",
    date: new Date("2026-07-18"),
    location: "Lake of the Ozarks",
    description: "The world's largest boating party. Thousands of boats gather for live music, floating stages, and non-stop fun on the water.",
    featuredCamId: "backwater-jacks-stage",
    type: "festival",
  },
  {
    id: "shootout-2026",
    title: "Lake of the Ozarks Shootout",
    date: new Date("2026-08-22"),
    endDate: new Date("2026-08-23"),
    location: "Captain Ron's / 33MM",
    description: "The largest unsanctioned boat race in the US. High-speed powerboat racing draws crowds from across the country.",
    featuredCamId: "dog-days-dock",
    type: "shootout",
  },
  {
    id: "lazy-gators-july",
    title: "Lazy Gators July 4th Concert",
    date: new Date("2026-07-04"),
    location: "Lazy Gators",
    description: "Fourth of July concert and fireworks at Lazy Gators. Live bands and lake views.",
    featuredCamId: "lazy-gators-stage",
    type: "concert",
  },
  {
    id: "dog-days-fireworks",
    title: "Dog Days Independence Day Fireworks",
    date: new Date("2026-07-04"),
    location: "Dog Days",
    description: "Independence Day fireworks over the lake. One of the best views at the Lake.",
    featuredCamId: "dog-days-pool",
    type: "fireworks",
  },
  {
    id: "lucys-live-music",
    title: "Lucy's at the Lake Live Music",
    date: new Date("2026-06-14"),
    location: "Bagnell Dam Strip",
    description: "Weekend live music at Lucy's on the Strip. Great atmosphere and lake vibes.",
    featuredCamId: "lucys-at-the-lake",
    type: "live-music",
  },
  {
    id: "neon-taco-nights",
    title: "Neon Taco Summer Nights",
    date: new Date("2026-06-21"),
    location: "Neon Taco Lakeside",
    description: "Summer concert series at Neon Taco. Tacos, drinks, and live music by the water.",
    featuredCamId: "neon-taco-stage",
    type: "concert",
  },
  {
    id: "backwater-concert",
    title: "Backwater Jack's Stage Night",
    date: new Date("2026-06-28"),
    location: "Backwater Jack's",
    description: "Live music on the famous Backwater Jack's stage. Where the Lake comes to party.",
    featuredCamId: "backwater-jacks-stage",
    type: "concert",
  },
  {
    id: "wicked-willies-summer",
    title: "Wicked Willies Summer Bash",
    date: new Date("2026-08-01"),
    location: "Wicked Willies",
    description: "Summer bash with live entertainment. Sports bar vibes and lake fun.",
    featuredCamId: "wicked-willies-bar",
    type: "live-music",
  },
];
