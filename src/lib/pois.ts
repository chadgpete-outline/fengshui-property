import poisJson from "../../data/pois.json";

import { distanceMeters, pointsWithinRadius } from "./geo";
import type { Coords, POI, POICategory } from "./types";

const POIS = poisJson as readonly POI[];

export function getAllPOIs(): readonly POI[] {
  return POIS;
}

export function getPOIsByCategory(category: POICategory): POI[] {
  return POIS.filter((p) => p.category === category);
}

export function getPOIsNear(
  center: Coords,
  radiusMeters: number,
  categories?: readonly POICategory[],
): Array<POI & { distanceMeters: number }> {
  const source = categories
    ? POIS.filter((p) => categories.includes(p.category))
    : POIS;
  return pointsWithinRadius(center, source, radiusMeters);
}

export function getNearestPOI(
  center: Coords,
  categories: readonly POICategory[],
): (POI & { distanceMeters: number }) | null {
  let best: (POI & { distanceMeters: number }) | null = null;
  for (const poi of POIS) {
    if (!categories.includes(poi.category)) continue;
    const d = distanceMeters(center, poi);
    if (!best || d < best.distanceMeters) {
      best = { ...poi, distanceMeters: d };
    }
  }
  return best;
}
