import { Metadata } from "next";
import { NightlifeClient } from "./nightlife-client";

export const metadata: Metadata = {
  title: "Nightlife",
  description: "Lake of the Ozarks nightlife hotspots. Live cams from bars, stages, and pools. Spyder Network.",
};

export default function NightlifePage() {
  return <NightlifeClient />;
}
