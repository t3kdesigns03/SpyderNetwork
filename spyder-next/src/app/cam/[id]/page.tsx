import { notFound } from "next/navigation";
import { cameras } from "@/data/cameras";
import { CamViewClient } from "./cam-view-client";

export async function generateStaticParams() {
  return cameras.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cam = cameras.find((c) => c.id === id);
  if (!cam) return {};
  return {
    title: `${cam.name} | Live Cam`,
    description: `Watch ${cam.name} live at ${cam.location}. Part of Spyder Network's Lake of the Ozarks camera network.`,
  };
}

export default async function CamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const camera = cameras.find((c) => c.id === id);
  if (!camera) notFound();

  return <CamViewClient camera={camera} />;
}
