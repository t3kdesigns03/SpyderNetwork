import { Metadata } from "next";
import { EventsPageClient } from "./events-client";

export const metadata: Metadata = {
  title: "Events",
  description: "2026 Lake of the Ozarks events: Aquapalooza, Shootout, concerts, and more.",
};

export default function EventsPage() {
  return <EventsPageClient />;
}
