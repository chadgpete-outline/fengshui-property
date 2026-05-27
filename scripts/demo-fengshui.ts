import { analyzeFormSchool } from "../src/lib/fengshui/form-school";

const samples = [
  { name: "Bishan Blk 123 (HDB)", lat: 1.3526, lon: 103.847 },
  { name: "Tampines Mall area", lat: 1.3526, lon: 103.9447 },
  { name: "Marina One Residences", lat: 1.2787, lon: 103.853 },
  { name: "Choa Chu Kang HDB", lat: 1.3855, lon: 103.7444 },
  { name: "Near Bukit Brown", lat: 1.3306, lon: 103.821 },
  { name: "Tuas industrial area", lat: 1.32, lon: 103.65 },
];

for (const s of samples) {
  const result = analyzeFormSchool({ lat: s.lat, lon: s.lon });

  console.log(`\n${"=".repeat(70)}`);
  console.log(`${s.name}  →  score: ${result.score}/10`);
  console.log(
    `(${result.summary.positives} positive, ${result.summary.negatives} negative)`,
  );
  console.log("=".repeat(70));

  if (result.factors.length === 0) {
    console.log("  (no notable factors detected within range)");
    continue;
  }

  for (const f of result.factors) {
    const sign = f.type === "positive" ? "+" : "-";
    const sev = "■".repeat(f.severity);
    console.log(`\n  [${sign}${sev}] ${f.title}`);
    console.log(`        ${f.description}`);
  }
}
