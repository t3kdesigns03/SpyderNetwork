import { Metadata } from "next";
import { FavoritesClient } from "./favorites-client";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your favorite Lake of the Ozarks live cams.",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
