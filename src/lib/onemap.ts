import "server-only";

import type { Coords } from "./types";

const ONEMAP_BASE = "https://www.onemap.gov.sg";

export type OneMapRevGeocodeResult = {
  buildingName: string;
  block: string;
  road: string;
  postalCode: string;
  lat: number;
  lon: number;
  distanceMeters: number;
};

type RawRevGeocodeAddress = {
  BUILDINGNAME?: string;
  BLOCK?: string;
  ROAD?: string;
  POSTALCODE?: string;
  LATITUDE?: string;
  LONGITUDE?: string;
  XCOORD?: string;
  YCOORD?: string;
};

function getToken(): string | null {
  return process.env.ONEMAP_TOKEN?.trim() || null;
}

function haversine(a: Coords, b: Coords): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat));
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function reverseGeocode(
  coords: Coords,
  bufferMeters = 80,
): Promise<OneMapRevGeocodeResult | null> {
  const token = getToken();
  if (!token) return null;

  const url = new URL(`${ONEMAP_BASE}/api/public/revgeocode`);
  url.searchParams.set("location", `${coords.lat},${coords.lon}`);
  url.searchParams.set("buffer", String(bufferMeters));
  url.searchParams.set("addressType", "all");
  url.searchParams.set("otherFeatures", "Y");

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: token },
      next: { revalidate: 86400 },
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;
  const data = (await res.json()) as { GeocodeInfo?: RawRevGeocodeAddress[] };

  const list = data.GeocodeInfo ?? [];
  if (list.length === 0) return null;

  const enriched = list
    .map((a) => {
      const lat = Number(a.LATITUDE);
      const lon = Number(a.LONGITUDE);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return {
        buildingName: (a.BUILDINGNAME || "").trim(),
        block: (a.BLOCK || "").trim(),
        road: (a.ROAD || "").trim(),
        postalCode: (a.POSTALCODE || "").trim(),
        lat,
        lon,
        distanceMeters: haversine(coords, { lat, lon }),
      } satisfies OneMapRevGeocodeResult;
    })
    .filter((x): x is OneMapRevGeocodeResult => x !== null)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return enriched[0] ?? null;
}

export function formatRevGeocodeAddress(r: OneMapRevGeocodeResult): string {
  const parts: string[] = [];
  if (r.block && r.road) {
    parts.push(`Blk ${r.block} ${r.road}`);
  } else if (r.road) {
    parts.push(r.road);
  } else if (r.buildingName) {
    parts.push(r.buildingName);
  }
  if (r.buildingName && r.buildingName !== parts[0]) {
    parts.push(r.buildingName);
  }
  if (r.postalCode && r.postalCode !== "NIL") {
    parts.push(`S${r.postalCode}`);
  }
  return parts.join(" · ");
}
