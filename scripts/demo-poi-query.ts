import { getNearestPOI, getPOIsNear } from "../src/lib/pois";

const samples = [
  { name: "Bishan Blk 123 (HDB)", lat: 1.3526, lon: 103.847 },
  { name: "Tampines Mall area", lat: 1.3526, lon: 103.9447 },
  { name: "Marina One Residences", lat: 1.2787, lon: 103.853 },
  { name: "Choa Chu Kang HDB", lat: 1.3855, lon: 103.7444 },
];

for (const s of samples) {
  console.log(`\n=== ${s.name} (${s.lat}, ${s.lon}) ===`);

  const nearestCemetery = getNearestPOI({ lat: s.lat, lon: s.lon }, [
    "cemetery",
  ]);
  if (nearestCemetery) {
    console.log(
      `  nearest cemetery: ${Math.round(nearestCemetery.distanceMeters)}m — ${nearestCemetery.name}`,
    );
  }

  const nearestHospital = getNearestPOI({ lat: s.lat, lon: s.lon }, [
    "hospital",
  ]);
  if (nearestHospital) {
    console.log(
      `  nearest hospital: ${Math.round(nearestHospital.distanceMeters)}m — ${nearestHospital.name}`,
    );
  }

  const nearestMRT = getNearestPOI({ lat: s.lat, lon: s.lon }, ["mrt_station"]);
  if (nearestMRT) {
    console.log(
      `  nearest MRT:      ${Math.round(nearestMRT.distanceMeters)}m — ${nearestMRT.name}`,
    );
  }

  const within500m = getPOIsNear({ lat: s.lat, lon: s.lon }, 500, [
    "park",
    "religious",
    "school",
    "power_station",
  ]);
  const counts: Record<string, number> = {};
  for (const p of within500m) counts[p.category] = (counts[p.category] ?? 0) + 1;
  const summary = Object.entries(counts)
    .map(([cat, n]) => `${n} ${cat}`)
    .join(", ");
  console.log(`  within 500m:      ${summary || "(none)"}`);
}
