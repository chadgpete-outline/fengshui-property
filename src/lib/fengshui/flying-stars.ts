// Xuan Kong Flying Stars (玄空飞星) — deterministic natal chart (下卦 method).
// Inputs: the unit's facing (one of 8 directions) and construction period.
// This is mathematics, not interpretation — the chart is always reproducible.

export type Dir8 = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type Palace = Dir8 | "C";

export type FlyingStarCell = {
  palace: Palace;
  base: number; // period (base) star
  mountain: number; // 山星 — health & relationships
  facing: number; // 向星 — wealth & opportunity
};

export type FlyingStarChart = {
  period: number;
  facing: Dir8;
  sitting: Dir8;
  cells: FlyingStarCell[]; // 9 cells in display order (SE S SW / E C W / NE N NW)
};

// Lo Shu flight path: where successive numbers land, starting from the centre.
const FLIGHT_PATH: Palace[] = ["C", "NW", "W", "NE", "S", "N", "SW", "E", "SE"];

const OPPOSITE: Record<Dir8, Dir8> = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
  NE: "SW",
  SW: "NE",
  SE: "NW",
  NW: "SE",
};

// Each Lo Shu digit's home trigram direction (5 has none → centre).
const DIGIT_DIR: Record<number, Palace> = {
  1: "N",
  2: "SW",
  3: "E",
  4: "SE",
  5: "C",
  6: "NW",
  7: "W",
  8: "NE",
  9: "S",
};

// The middle mountain of the diagonal trigrams (艮巽坤乾) is yang → forward flight;
// the cardinals (子卯午酉) are yin → reverse flight.
const DIAGONAL = new Set<Dir8>(["NE", "SE", "SW", "NW"]);

const DISPLAY_ORDER: Palace[] = [
  "SE",
  "S",
  "SW",
  "E",
  "C",
  "W",
  "NE",
  "N",
  "NW",
];

function wrap9(n: number): number {
  return (((n - 1) % 9) + 9) % 9 + 1;
}

function fly(center: number, forward: boolean): Record<Palace, number> {
  const out = {} as Record<Palace, number>;
  let v = center;
  for (const p of FLIGHT_PATH) {
    out[p] = v;
    v = wrap9(forward ? v + 1 : v - 1);
  }
  return out;
}

export function periodFromYear(year?: number): number {
  if (!year || !Number.isFinite(year)) return 9; // current period by default
  const p = Math.floor((year - 1864) / 20) + 1;
  return Math.min(9, Math.max(1, p));
}

// Flight is forward when the governing mountain is yang. For a digit we read its
// home trigram; for 5 (no trigram) we borrow the palace it occupies.
function isForward(digit: number, palace: Dir8): boolean {
  const dir = DIGIT_DIR[digit];
  const d = dir === "C" ? palace : dir;
  return DIAGONAL.has(d as Dir8);
}

export function computeFlyingStars(facing: Dir8, year?: number): FlyingStarChart {
  const period = periodFromYear(year);
  const sitting = OPPOSITE[facing];

  const base = fly(period, true);
  const facingStar = fly(base[facing], isForward(base[facing], facing));
  const mountainStar = fly(base[sitting], isForward(base[sitting], sitting));

  const cells: FlyingStarCell[] = DISPLAY_ORDER.map((p) => ({
    palace: p,
    base: base[p],
    mountain: mountainStar[p],
    facing: facingStar[p],
  }));

  return { period, facing, sitting, cells };
}

export const PERIOD_9_FAVOURABLE = new Set([9, 1, 8]);
export const PERIOD_9_INAUSPICIOUS = new Set([2, 5]);
