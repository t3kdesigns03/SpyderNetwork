export type CameraCategory = "All" | "Bars & Grills" | "Pools" | "Docks" | "Stages" | "Views" | "Other";

export interface Camera {
  id: string;
  name: string;
  location: string;
  twitchChannel: string;
  category: CameraCategory;
  website?: string;
  description?: string;
}

export const cameras: Camera[] = [
  // Backwater Jacks
  {
    id: "backwater-jacks-pool",
    name: "Backwater Jack's Pool",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork3",
    category: "Pools",
    website: "https://backwaterjacks.com/",
    description: "Where the Lake Comes to Party — poolside cocktails, fresh food, live music.",
  },
  {
    id: "backwater-jacks-stage",
    name: "Backwater Jack's Stage",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork5",
    category: "Stages",
    website: "https://backwaterjacks.com/",
  },
  {
    id: "backwater-jacks-dock",
    name: "Backwater Jack's Dock",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork12",
    category: "Docks",
    website: "https://backwaterjacks.com/",
  },
  {
    id: "backwater-jacks-dock-2",
    name: "Backwater Jack's Dock 2",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork4",
    category: "Docks",
    website: "https://backwaterjacks.com/",
  },

  // Tucker Shuckers
  {
    id: "tucker-shuckers-north",
    name: "Tucker Shuckers North",
    location: "Bagnell Dam Strip",
    twitchChannel: "spydernetwork2",
    category: "Bars & Grills",
    website: "https://tuckersshuckers.com/",
    description: "Fresh Oysters & 28 Tap Beers at Lake of the Ozarks.",
  },
  {
    id: "tucker-shuckers-south",
    name: "Tucker Shuckers South",
    location: "Bagnell Dam Strip",
    twitchChannel: "spydernetwork1",
    category: "Bars & Grills",
    website: "https://tuckersshuckers.com/",
  },

  // Dog Days
  {
    id: "dog-days-stage",
    name: "Dog Days Stage",
    location: "Osage Beach",
    twitchChannel: "spydernetwork27",
    category: "Stages",
    website: "https://dogdays.ws/",
    description: "Lake of the Ozarks' Premier Waterfront Destination since 1993.",
  },
  {
    id: "dog-days-pool",
    name: "Dog Days Pool",
    location: "Osage Beach",
    twitchChannel: "spydernetwork26",
    category: "Pools",
    website: "https://dogdays.ws/",
  },
  {
    id: "dog-days-dock",
    name: "Dog Days Dock",
    location: "Osage Beach",
    twitchChannel: "spydernetwork28",
    category: "Docks",
    website: "https://dogdays.ws/",
  },
  {
    id: "dog-days-dock-2",
    name: "Dog Days Dock 2",
    location: "Osage Beach",
    twitchChannel: "spydernetwork29",
    category: "Docks",
    website: "https://dogdays.ws/",
  },

  // Fish and Company
  {
    id: "fish-and-company-stage",
    name: "Fish & Company Stage",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork35",
    category: "Stages",
    website: "https://thefishandcompany.com/",
    description: "Fresh seafood, live music, and entertainment.",
  },
  {
    id: "fish-and-company-patio",
    name: "Fish & Company Patio",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork36",
    category: "Bars & Grills",
    website: "https://thefishandcompany.com/",
  },
  {
    id: "fish-and-company-dock",
    name: "Fish & Company Dock",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork37",
    category: "Docks",
    website: "https://thefishandcompany.com/",
  },
  {
    id: "fish-and-company-jetski",
    name: "Fish & Company Jet Ski Dock",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork38",
    category: "Docks",
    website: "https://thefishandcompany.com/",
  },

  // Wicked Willies
  {
    id: "wicked-willies-patio",
    name: "Wicked Willies Patio",
    location: "Osage Beach",
    twitchChannel: "spydernetwork49",
    category: "Bars & Grills",
    website: "https://wickedwilliessportsgrill.com/",
    description: "The Lake's go-to spot for sports, food & family fun.",
  },
  {
    id: "wicked-willies-bar",
    name: "Wicked Willies Bar",
    location: "Osage Beach",
    twitchChannel: "spydernetwork47",
    category: "Bars & Grills",
    website: "https://wickedwilliessportsgrill.com/",
  },
  {
    id: "wicked-willies-lounge",
    name: "Wicked Willies Lounge",
    location: "Osage Beach",
    twitchChannel: "spydernetwork48",
    category: "Bars & Grills",
    website: "https://wickedwilliessportsgrill.com/",
  },

  // Neon Taco
  {
    id: "neon-taco-bar",
    name: "Neon Taco Lakeside Bar",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork40",
    category: "Bars & Grills",
    website: "https://www.theneontaco.com/",
  },
  {
    id: "neon-taco-stage",
    name: "Neon Taco Stage",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork41",
    category: "Stages",
    website: "https://www.theneontaco.com/",
  },
  {
    id: "neon-taco-docks",
    name: "Neon Taco Docks",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork42",
    category: "Docks",
    website: "https://www.theneontaco.com/",
  },

  // Lazy Gators
  {
    id: "lazy-gators-stage",
    name: "Lazy Gators Stage",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork20",
    category: "Stages",
    website: "http://lazygators.com/",
  },
  {
    id: "lazy-gators-view",
    name: "Lazy Gators View",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork21",
    category: "Views",
    website: "http://lazygators.com/",
  },
  {
    id: "lazy-gators-pool",
    name: "Lazy Gators Pool",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork22",
    category: "Pools",
    website: "http://lazygators.com/",
  },
  {
    id: "lazy-gators-dock-1",
    name: "Lazy Gators Dock 1",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork23",
    category: "Docks",
    website: "http://lazygators.com/",
  },
  {
    id: "lazy-gators-dock-2",
    name: "Lazy Gators Dock 2",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork24",
    category: "Docks",
    website: "http://lazygators.com/",
  },

  // Encore
  {
    id: "encore",
    name: "Encore Lakeside Grill",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork30",
    category: "Bars & Grills",
    website: "https://theencoregrill.com/",
    description: "Sky Bar Stage — The finest Restaurant and Entertainment Complex.",
  },

  // KRMS
  {
    id: "krms-studio",
    name: "KRMS Studio",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork14",
    category: "Other",
    website: "https://www.krmsradio.com/",
  },
  {
    id: "krms-north",
    name: "KRMS North Tower",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork15",
    category: "Views",
    website: "https://www.krmsradio.com/",
  },
  {
    id: "krms-east",
    name: "KRMS East Tower",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork16",
    category: "Views",
    website: "https://www.krmsradio.com/",
  },
  {
    id: "krms-south-east",
    name: "KRMS SE Tower",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork17",
    category: "Views",
    website: "https://www.krmsradio.com/",
  },

  // Alhonna Resort
  {
    id: "alhonna-indoor",
    name: "Alhonna Resort Indoor Pool",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork6",
    category: "Pools",
    website: "https://thealhonnaresort.com/",
  },
  {
    id: "alhonna-outdoor",
    name: "Alhonna Resort Outdoor Pool",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork7",
    category: "Pools",
    website: "https://thealhonnaresort.com/",
  },

  // Alley Cats
  {
    id: "alley-cats-north",
    name: "Alley Cats North",
    location: "Bagnell Dam Strip",
    twitchChannel: "spydernetwork8",
    category: "Bars & Grills",
    website: "http://www.alleycatsonthestrip.com/",
  },
  {
    id: "alley-cats-south",
    name: "Alley Cats South",
    location: "Bagnell Dam Strip",
    twitchChannel: "spydernetwork9",
    category: "Bars & Grills",
    website: "http://www.alleycatsonthestrip.com/",
  },

  // Dogwood Animal Shelter
  {
    id: "dogwood-animal-shelter",
    name: "Dogwood Animal Shelter",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork59",
    category: "Other",
    website: "https://www.daslakeoftheozarks.com/",
    description: "Live cam of adorable shelter animals.",
  },

  // Marty Byrde's
  {
    id: "marty-byrds-outside",
    name: "Marty Byrde's Outside",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork44",
    category: "Bars & Grills",
    website: "https://martybyrde.com/",
  },
  {
    id: "marty-byrds-inside",
    name: "Marty Byrde's Inside",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork45",
    category: "Bars & Grills",
    website: "https://martybyrde.com/",
  },

  // Double D's
  {
    id: "double-ds-roadhouse",
    name: "Double D's Roadhouse",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork31",
    category: "Bars & Grills",
    website: "https://www.daslakeoftheozarks.com/",
  },
  {
    id: "double-ds-gameroom",
    name: "Double D's Gameroom",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork32",
    category: "Other",
  },

  // Michael's Steak Chalet
  {
    id: "michaels-steak-chalet-view",
    name: "Michael's Steak Chalet View",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork50",
    category: "Views",
    website: "https://steakchalet.com/",
  },
  {
    id: "michaels-steak-chalet",
    name: "Michael's Steak Chalet",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork51",
    category: "Bars & Grills",
    website: "https://steakchalet.com/",
  },

  // Paradise
  {
    id: "paradise-1",
    name: "Paradise Restaurant",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork52",
    category: "Bars & Grills",
    website: "https://www.paradiseatthelake.com/",
  },
  {
    id: "paradise-2",
    name: "Paradise Bar",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork53",
    category: "Bars & Grills",
    website: "https://www.paradiseatthelake.com/",
  },

  // The Hatch
  {
    id: "the-hatch",
    name: "The Hatch at Miller's Landing",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork54",
    category: "Bars & Grills",
    website: "https://www.facebook.com/TheHatchLOZ",
  },

  // Linn Creek Cove / SpyderNetwork HQ
  {
    id: "spydernetwork-dock",
    name: "Linn Creek Cove",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork10",
    category: "Docks",
  },

  // Bridgeview Marina
  {
    id: "bridgeview-marina",
    name: "Bridgeview Marina",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork11",
    category: "Docks",
  },

  // Lake Billiards
  {
    id: "lake-billiards",
    name: "Lake Billiards Sports Bar",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork33",
    category: "Bars & Grills",
    website: "https://lakebilliards.com/",
  },

  // Lucy's
  {
    id: "lucys-at-the-lake",
    name: "Lucy's at the Lake",
    location: "Bagnell Dam Strip",
    twitchChannel: "spydernetwork43",
    category: "Bars & Grills",
  },

  // Topsider
  {
    id: "topsiders-condos",
    name: "Topsider Condos & Bridge",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork55",
    category: "Views",
  },

  // Ellerman
  {
    id: "ellerman",
    name: "Ellerman Lake View MM 17",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork34",
    category: "Views",
  },

  // Dock Glide
  {
    id: "dock-glide",
    name: "Dock Glide",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork13",
    category: "Other",
    website: "https://dockglide.com/",
  },

  // Annamarie Hopkins
  {
    id: "annamarie-hopkins",
    name: "Annamarie Hopkins Real Estate",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork19",
    category: "Other",
    website: "https://asmartermove.com/",
  },

  // Camdenton Glass
  {
    id: "camdenton-glass-north",
    name: "Camdenton Glass North",
    location: "Camdenton",
    twitchChannel: "spydernetwork56",
    category: "Views",
    website: "https://camdentonglass.com/",
  },
  {
    id: "camdenton-glass-south",
    name: "Camdenton Glass South",
    location: "Camdenton",
    twitchChannel: "spydernetwork57",
    category: "Views",
    website: "https://camdentonglass.com/",
  },

  // Lake & Land Trading
  {
    id: "lake-land-trading",
    name: "Lake & Land Trading Co.",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork46",
    category: "Other",
  },

  // Split Arrow
  {
    id: "split-arrow-boutique",
    name: "Split Arrow Boutique",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork58",
    category: "Other",
  },

  // Outlaws
  {
    id: "outlaws-mens-outpost",
    name: "Outlaws Men's Outpost",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork60",
    category: "Other",
  },

  // Cactus Blossom
  {
    id: "cactus-blossom",
    name: "The Cactus Blossom Boutique",
    location: "Lake of the Ozarks",
    twitchChannel: "spydernetwork61",
    category: "Other",
  },
];

export const categories: CameraCategory[] = [
  "All",
  "Bars & Grills",
  "Pools",
  "Stages",
  "Docks",
  "Views",
  "Other",
];
