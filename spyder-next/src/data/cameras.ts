export type CameraCategory = "All" | "Bars & Grills" | "Pools" | "Docks" | "Stages" | "Views" | "Other";
export type CrowdLevel = "Low" | "Medium" | "High" | "Packed";

const DEMO_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny_720p.mp4";

export interface Camera {
  id: string;
  name: string;
  location: string;
  twitchChannel: string;
  category: CameraCategory;
  videoUrl: string;
  lat: number;
  lng: number;
  crowdLevel: CrowdLevel;
  viewerCount?: number; // fake viewer count for heat layer
  website?: string;
  description?: string;
}

function fakeViewerCount(crowdLevel: CrowdLevel, id: string): number {
  const base = { Low: 12, Medium: 47, High: 128, Packed: 312 };
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = (hash % 30) - 15;
  return Math.max(5, base[crowdLevel] + jitter);
}

const rawCameras: Omit<Camera, "viewerCount">[] = [
  { id: "backwater-jacks-pool", name: "Backwater Jack's Pool", location: "Lake of the Ozarks", twitchChannel: "spydernetwork3", category: "Pools", videoUrl: DEMO_VIDEO, lat: 38.128, lng: -92.642, crowdLevel: "High", website: "https://backwaterjacks.com/", description: "Where the Lake Comes to Party — poolside cocktails, fresh food, live music." },
  { id: "backwater-jacks-stage", name: "Backwater Jack's Stage", location: "Lake of the Ozarks", twitchChannel: "spydernetwork5", category: "Stages", videoUrl: DEMO_VIDEO, lat: 38.129, lng: -92.643, crowdLevel: "Packed", website: "https://backwaterjacks.com/" },
  { id: "backwater-jacks-dock", name: "Backwater Jack's Dock", location: "Lake of the Ozarks", twitchChannel: "spydernetwork12", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.127, lng: -92.641, crowdLevel: "Medium", website: "https://backwaterjacks.com/" },
  { id: "backwater-jacks-dock-2", name: "Backwater Jack's Dock 2", location: "Lake of the Ozarks", twitchChannel: "spydernetwork4", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.126, lng: -92.644, crowdLevel: "Medium", website: "https://backwaterjacks.com/" },
  { id: "tucker-shuckers-north", name: "Tucker Shuckers North", location: "Bagnell Dam Strip", twitchChannel: "spydernetwork2", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.215, lng: -92.618, crowdLevel: "High", website: "https://tuckersshuckers.com/", description: "Fresh Oysters & 28 Tap Beers at Lake of the Ozarks." },
  { id: "tucker-shuckers-south", name: "Tucker Shuckers South", location: "Bagnell Dam Strip", twitchChannel: "spydernetwork1", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.214, lng: -92.617, crowdLevel: "Medium", website: "https://tuckersshuckers.com/" },
  { id: "dog-days-stage", name: "Dog Days Stage", location: "Osage Beach", twitchChannel: "spydernetwork27", category: "Stages", videoUrl: DEMO_VIDEO, lat: 38.142, lng: -92.668, crowdLevel: "High", website: "https://dogdays.ws/", description: "Lake of the Ozarks' Premier Waterfront Destination since 1993." },
  { id: "dog-days-pool", name: "Dog Days Pool", location: "Osage Beach", twitchChannel: "spydernetwork26", category: "Pools", videoUrl: DEMO_VIDEO, lat: 38.141, lng: -92.667, crowdLevel: "Packed", website: "https://dogdays.ws/" },
  { id: "dog-days-dock", name: "Dog Days Dock", location: "Osage Beach", twitchChannel: "spydernetwork28", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.143, lng: -92.669, crowdLevel: "Medium", website: "https://dogdays.ws/" },
  { id: "dog-days-dock-2", name: "Dog Days Dock 2", location: "Osage Beach", twitchChannel: "spydernetwork29", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.144, lng: -92.670, crowdLevel: "Low", website: "https://dogdays.ws/" },
  { id: "fish-and-company-stage", name: "Fish & Company Stage", location: "Lake of the Ozarks", twitchChannel: "spydernetwork35", category: "Stages", videoUrl: DEMO_VIDEO, lat: 38.165, lng: -92.655, crowdLevel: "Medium", website: "https://thefishandcompany.com/", description: "Fresh seafood, live music, and entertainment." },
  { id: "fish-and-company-patio", name: "Fish & Company Patio", location: "Lake of the Ozarks", twitchChannel: "spydernetwork36", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.164, lng: -92.654, crowdLevel: "High", website: "https://thefishandcompany.com/" },
  { id: "fish-and-company-dock", name: "Fish & Company Dock", location: "Lake of the Ozarks", twitchChannel: "spydernetwork37", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.166, lng: -92.656, crowdLevel: "Low", website: "https://thefishandcompany.com/" },
  { id: "fish-and-company-jetski", name: "Fish & Company Jet Ski Dock", location: "Lake of the Ozarks", twitchChannel: "spydernetwork38", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.167, lng: -92.657, crowdLevel: "Medium", website: "https://thefishandcompany.com/" },
  { id: "wicked-willies-patio", name: "Wicked Willies Patio", location: "Osage Beach", twitchChannel: "spydernetwork49", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.138, lng: -92.662, crowdLevel: "High", website: "https://wickedwilliessportsgrill.com/", description: "The Lake's go-to spot for sports, food & family fun." },
  { id: "wicked-willies-bar", name: "Wicked Willies Bar", location: "Osage Beach", twitchChannel: "spydernetwork47", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.137, lng: -92.661, crowdLevel: "Packed", website: "https://wickedwilliessportsgrill.com/" },
  { id: "wicked-willies-lounge", name: "Wicked Willies Lounge", location: "Osage Beach", twitchChannel: "spydernetwork48", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.139, lng: -92.663, crowdLevel: "Medium", website: "https://wickedwilliessportsgrill.com/" },
  { id: "neon-taco-bar", name: "Neon Taco Lakeside Bar", location: "Lake of the Ozarks", twitchChannel: "spydernetwork40", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.152, lng: -92.648, crowdLevel: "High", website: "https://www.theneontaco.com/" },
  { id: "neon-taco-stage", name: "Neon Taco Stage", location: "Lake of the Ozarks", twitchChannel: "spydernetwork41", category: "Stages", videoUrl: DEMO_VIDEO, lat: 38.153, lng: -92.649, crowdLevel: "Medium", website: "https://www.theneontaco.com/" },
  { id: "neon-taco-docks", name: "Neon Taco Docks", location: "Lake of the Ozarks", twitchChannel: "spydernetwork42", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.151, lng: -92.647, crowdLevel: "Low", website: "https://www.theneontaco.com/" },
  { id: "lazy-gators-stage", name: "Lazy Gators Stage", location: "Lake of the Ozarks", twitchChannel: "spydernetwork20", category: "Stages", videoUrl: DEMO_VIDEO, lat: 38.118, lng: -92.635, crowdLevel: "Packed", website: "http://lazygators.com/" },
  { id: "lazy-gators-view", name: "Lazy Gators View", location: "Lake of the Ozarks", twitchChannel: "spydernetwork21", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.117, lng: -92.634, crowdLevel: "Low", website: "http://lazygators.com/" },
  { id: "lazy-gators-pool", name: "Lazy Gators Pool", location: "Lake of the Ozarks", twitchChannel: "spydernetwork22", category: "Pools", videoUrl: DEMO_VIDEO, lat: 38.119, lng: -92.636, crowdLevel: "High", website: "http://lazygators.com/" },
  { id: "lazy-gators-dock-1", name: "Lazy Gators Dock 1", location: "Lake of the Ozarks", twitchChannel: "spydernetwork23", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.116, lng: -92.633, crowdLevel: "Medium", website: "http://lazygators.com/" },
  { id: "lazy-gators-dock-2", name: "Lazy Gators Dock 2", location: "Lake of the Ozarks", twitchChannel: "spydernetwork24", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.115, lng: -92.632, crowdLevel: "Medium", website: "http://lazygators.com/" },
  { id: "encore", name: "Encore Lakeside Grill", location: "Lake of the Ozarks", twitchChannel: "spydernetwork30", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.178, lng: -92.658, crowdLevel: "High", website: "https://theencoregrill.com/", description: "Sky Bar Stage — The finest Restaurant and Entertainment Complex." },
  { id: "krms-studio", name: "KRMS Studio", location: "Lake of the Ozarks", twitchChannel: "spydernetwork14", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.198, lng: -92.605, crowdLevel: "Low", website: "https://www.krmsradio.com/" },
  { id: "krms-north", name: "KRMS North Tower", location: "Lake of the Ozarks", twitchChannel: "spydernetwork15", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.212, lng: -92.602, crowdLevel: "Low", website: "https://www.krmsradio.com/" },
  { id: "krms-east", name: "KRMS East Tower", location: "Lake of the Ozarks", twitchChannel: "spydernetwork16", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.200, lng: -92.598, crowdLevel: "Low", website: "https://www.krmsradio.com/" },
  { id: "krms-south-east", name: "KRMS SE Tower", location: "Lake of the Ozarks", twitchChannel: "spydernetwork17", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.185, lng: -92.592, crowdLevel: "Low", website: "https://www.krmsradio.com/" },
  { id: "alhonna-indoor", name: "Alhonna Resort Indoor Pool", location: "Lake of the Ozarks", twitchChannel: "spydernetwork6", category: "Pools", videoUrl: DEMO_VIDEO, lat: 38.095, lng: -92.625, crowdLevel: "Medium", website: "https://thealhonnaresort.com/" },
  { id: "alhonna-outdoor", name: "Alhonna Resort Outdoor Pool", location: "Lake of the Ozarks", twitchChannel: "spydernetwork7", category: "Pools", videoUrl: DEMO_VIDEO, lat: 38.094, lng: -92.624, crowdLevel: "High", website: "https://thealhonnaresort.com/" },
  { id: "alley-cats-north", name: "Alley Cats North", location: "Bagnell Dam Strip", twitchChannel: "spydernetwork8", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.218, lng: -92.615, crowdLevel: "High", website: "http://www.alleycatsonthestrip.com/" },
  { id: "alley-cats-south", name: "Alley Cats South", location: "Bagnell Dam Strip", twitchChannel: "spydernetwork9", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.217, lng: -92.614, crowdLevel: "Medium", website: "http://www.alleycatsonthestrip.com/" },
  { id: "dogwood-animal-shelter", name: "Dogwood Animal Shelter", location: "Lake of the Ozarks", twitchChannel: "spydernetwork59", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.175, lng: -92.672, crowdLevel: "Low", website: "https://www.daslakeoftheozarks.com/", description: "Live cam of adorable shelter animals." },
  { id: "marty-byrds-outside", name: "Marty Byrde's Outside", location: "Lake of the Ozarks", twitchChannel: "spydernetwork44", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.155, lng: -92.638, crowdLevel: "Packed", website: "https://martybyrde.com/" },
  { id: "marty-byrds-inside", name: "Marty Byrde's Inside", location: "Lake of the Ozarks", twitchChannel: "spydernetwork45", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.156, lng: -92.639, crowdLevel: "High", website: "https://martybyrde.com/" },
  { id: "double-ds-roadhouse", name: "Double D's Roadhouse", location: "Lake of the Ozarks", twitchChannel: "spydernetwork31", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.168, lng: -92.651, crowdLevel: "Medium", website: "https://www.daslakeoftheozarks.com/" },
  { id: "double-ds-gameroom", name: "Double D's Gameroom", location: "Lake of the Ozarks", twitchChannel: "spydernetwork32", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.169, lng: -92.652, crowdLevel: "Low" },
  { id: "michaels-steak-chalet-view", name: "Michael's Steak Chalet View", location: "Lake of the Ozarks", twitchChannel: "spydernetwork50", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.092, lng: -92.618, crowdLevel: "Low", website: "https://steakchalet.com/" },
  { id: "michaels-steak-chalet", name: "Michael's Steak Chalet", location: "Lake of the Ozarks", twitchChannel: "spydernetwork51", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.091, lng: -92.617, crowdLevel: "Medium", website: "https://steakchalet.com/" },
  { id: "paradise-1", name: "Paradise Restaurant", location: "Lake of the Ozarks", twitchChannel: "spydernetwork52", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.108, lng: -92.628, crowdLevel: "High", website: "https://www.paradiseatthelake.com/" },
  { id: "paradise-2", name: "Paradise Bar", location: "Lake of the Ozarks", twitchChannel: "spydernetwork53", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.107, lng: -92.627, crowdLevel: "Medium", website: "https://www.paradiseatthelake.com/" },
  { id: "the-hatch", name: "The Hatch at Miller's Landing", location: "Lake of the Ozarks", twitchChannel: "spydernetwork54", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.088, lng: -92.612, crowdLevel: "Medium", website: "https://www.facebook.com/TheHatchLOZ" },
  { id: "spydernetwork-dock", name: "Linn Creek Cove", location: "Lake of the Ozarks", twitchChannel: "spydernetwork10", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.055, lng: -92.698, crowdLevel: "Low" },
  { id: "bridgeview-marina", name: "Bridgeview Marina", location: "Lake of the Ozarks", twitchChannel: "spydernetwork11", category: "Docks", videoUrl: DEMO_VIDEO, lat: 38.062, lng: -92.685, crowdLevel: "Medium" },
  { id: "lake-billiards", name: "Lake Billiards Sports Bar", location: "Lake of the Ozarks", twitchChannel: "spydernetwork33", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.172, lng: -92.654, crowdLevel: "High", website: "https://lakebilliards.com/" },
  { id: "lucys-at-the-lake", name: "Lucy's at the Lake", location: "Bagnell Dam Strip", twitchChannel: "spydernetwork43", category: "Bars & Grills", videoUrl: DEMO_VIDEO, lat: 38.220, lng: -92.612, crowdLevel: "Medium" },
  { id: "topsiders-condos", name: "Topsider Condos & Bridge", location: "Lake of the Ozarks", twitchChannel: "spydernetwork55", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.135, lng: -92.645, crowdLevel: "Low" },
  { id: "ellerman", name: "Ellerman Lake View MM 17", location: "Lake of the Ozarks", twitchChannel: "spydernetwork34", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.072, lng: -92.708, crowdLevel: "Low" },
  { id: "dock-glide", name: "Dock Glide", location: "Lake of the Ozarks", twitchChannel: "spydernetwork13", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.148, lng: -92.665, crowdLevel: "Low", website: "https://dockglide.com/" },
  { id: "annamarie-hopkins", name: "Annamarie Hopkins Real Estate", location: "Lake of the Ozarks", twitchChannel: "spydernetwork19", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.162, lng: -92.648, crowdLevel: "Low", website: "https://asmartermove.com/" },
  { id: "camdenton-glass-north", name: "Camdenton Glass North", location: "Camdenton", twitchChannel: "spydernetwork56", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.008, lng: -92.745, crowdLevel: "Low", website: "https://camdentonglass.com/" },
  { id: "camdenton-glass-south", name: "Camdenton Glass South", location: "Camdenton", twitchChannel: "spydernetwork57", category: "Views", videoUrl: DEMO_VIDEO, lat: 38.007, lng: -92.744, crowdLevel: "Low", website: "https://camdentonglass.com/" },
  { id: "lake-land-trading", name: "Lake & Land Trading Co.", location: "Lake of the Ozarks", twitchChannel: "spydernetwork46", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.158, lng: -92.642, crowdLevel: "Low" },
  { id: "split-arrow-boutique", name: "Split Arrow Boutique", location: "Lake of the Ozarks", twitchChannel: "spydernetwork58", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.145, lng: -92.658, crowdLevel: "Low" },
  { id: "outlaws-mens-outpost", name: "Outlaws Men's Outpost", location: "Lake of the Ozarks", twitchChannel: "spydernetwork60", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.152, lng: -92.655, crowdLevel: "Low" },
  { id: "cactus-blossom", name: "The Cactus Blossom Boutique", location: "Lake of the Ozarks", twitchChannel: "spydernetwork61", category: "Other", videoUrl: DEMO_VIDEO, lat: 38.149, lng: -92.660, crowdLevel: "Low" },
];

export const cameras: Camera[] = rawCameras.map((c) => ({
  ...c,
  viewerCount: fakeViewerCount(c.crowdLevel, c.id),
}));

export const categories: CameraCategory[] = ["All", "Bars & Grills", "Pools", "Stages", "Docks", "Views", "Other"];
