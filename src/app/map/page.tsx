import type { Metadata } from "next";

import { SiteMasthead } from "@/components/site-masthead";

import { MapClient } from "./map-client";

export const metadata: Metadata = {
  title: "Map · Fengshui AI",
  description:
    "Click anywhere on the map of Singapore for an instant AI fengshui reading — form school analysis with classical references.",
};

export default function MapPage() {
  return (
    <>
      <SiteMasthead />
      <MapClient />
    </>
  );
}
