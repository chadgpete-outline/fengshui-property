"use client";

import type { FlyingStarChart } from "@/lib/fengshui/flying-stars";

export function FlyingStarsGrid({ chart }: { chart: FlyingStarChart }) {
  return (
    <div>
      <div className="grid grid-cols-3 border border-ink bg-surface">
        {chart.cells.map((c) => (
          <div
            key={c.palace}
            className={`relative aspect-square border border-line-soft p-2 flex flex-col ${
              c.palace === "C" ? "bg-bg-warm" : ""
            }`}
          >
            <div className="flex items-start justify-between leading-none">
              <span
                className="numeral text-sm text-jade"
                title="Mountain star (山) — health & relationships"
              >
                {c.mountain}
              </span>
              <span
                className="numeral text-sm text-cinnabar"
                title="Water star (向) — wealth & opportunity"
              >
                {c.facing}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="numeral text-2xl text-ink/35">{c.base}</span>
            </div>
            <div className="text-[8px] tracking-[0.2em] uppercase text-muted text-center">
              {c.palace === "C" ? "中" : c.palace}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[10px] tracking-wide text-muted">
        <span>
          <span className="text-jade">●</span> mountain 山
        </span>
        <span>
          <span className="text-cinnabar">●</span> water 向
        </span>
        <span className="text-ink/40">● base 运</span>
      </div>
    </div>
  );
}
