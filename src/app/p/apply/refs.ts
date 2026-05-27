const VALID_REFS = new Set([
  "alpha-2026",
  "cea-2026-batch-1",
  "founders-circle",
  "propnex-pilot",
  "era-pilot",
]);

export function isValidRef(ref: string | null | undefined): boolean {
  if (!ref) return false;
  return VALID_REFS.has(ref.trim().toLowerCase());
}
