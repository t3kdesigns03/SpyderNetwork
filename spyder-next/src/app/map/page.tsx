import { Metadata } from "next";
import { MapView } from "@/components/map-view";

export const metadata: Metadata = {
  title: "Interactive Map",
  description: "Explore all Spyder Network cameras on an interactive map of Lake of the Ozarks.",
};

export default function MapPage() {
  return <MapView />;
}
