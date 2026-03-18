import { notFound } from "next/navigation";
import { cameras } from "@/data/cameras";
import { CamViewClient } from "./cam-view-client";
import { JsonLdVideo } from "@/components/json-ld-video";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spydernetwork.com";

export async function generateStaticParams() {
  return cameras.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cam = cameras.find((c) => c.id === id);
  if (!cam) return {};
  const title = `${cam.name} | Live Cam | Spyder Network`;
  const description = cam.description || `Watch ${cam.name} live at ${cam.location}. Part of Spyder Network's Lake of the Ozarks camera network.`;
  const url = `${BASE_URL}/cam/${cam.id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Spyder Network",
      type: "website",
      images: [{ url: `${BASE_URL}/placeholder.svg`, width: 1200, height: 630, alt: cam.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

export default async function CamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const camera = cameras.find((c) => c.id === id);
  if (!camera) notFound();

  return (
    <>
      <JsonLdVideo camera={camera} />
      <CamViewClient camera={camera} />
    </>
  );
}
