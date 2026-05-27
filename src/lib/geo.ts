import type { Coords } from "./types";

const EARTH_RADIUS_M = 6_371_000;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function distanceMeters(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function bearingDegrees(from: Coords, to: Coords): number {
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLon = toRad(to.lon - from.lon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export type CardinalDirection =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";

const CARDINALS: readonly CardinalDirection[] = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const;

export function bearingToCardinal(bearing: number): CardinalDirection {
  return CARDINALS[Math.floor(((bearing + 22.5) % 360) / 45)];
}

const MOUNTAINS_24 = [
  "壬",
  "子",
  "癸",
  "丑",
  "艮",
  "寅",
  "甲",
  "卯",
  "乙",
  "辰",
  "巽",
  "巳",
  "丙",
  "午",
  "丁",
  "未",
  "坤",
  "申",
  "庚",
  "酉",
  "辛",
  "戌",
  "乾",
  "亥",
] as const;

export type Mountain = (typeof MOUNTAINS_24)[number];

export function bearingToMountain(bearing: number): Mountain {
  const idx = Math.floor(((bearing - 352.5 + 360) % 360) / 15);
  return MOUNTAINS_24[idx];
}

export function pointsWithinRadius<T extends Coords>(
  center: Coords,
  points: readonly T[],
  radiusMeters: number,
): Array<T & { distanceMeters: number }> {
  const result: Array<T & { distanceMeters: number }> = [];
  for (const p of points) {
    const d = distanceMeters(center, p);
    if (d <= radiusMeters) {
      result.push({ ...p, distanceMeters: d });
    }
  }
  result.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return result;
}
