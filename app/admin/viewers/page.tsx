import type { Metadata } from "next";
import { ViewersDashboard } from "./ViewersDashboard";

// Internal monitoring page — keep it out of search indexes.
export const metadata: Metadata = {
  title: "Viewer Monitor · SpyderNetwork",
  robots: { index: false, follow: false },
};

export default function AdminViewersPage() {
  return <ViewersDashboard />;
}
