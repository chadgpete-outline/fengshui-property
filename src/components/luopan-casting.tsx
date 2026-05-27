"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Aligning the luópán · 罗盘",
  "Taking the facing · 立向",
  "Casting the nine palaces · 九宫",
  "Flying the mountain & water stars · 飞星",
  "Reading the form · 峦头",
];

// Later-Heaven trigrams placed around the dial.
const TRIGRAMS = ["☲", "☷", "☱", "☰", "☵", "☶", "☳", "☴"];

export function LuopanCasting() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  const trigrams = TRIGRAMS.map((g, i) => {
    const a = ((i * 45 - 90) * Math.PI) / 180;
    return { g, x: 100 + 58 * Math.cos(a), y: 100 + 58 * Math.sin(a) };
  });

  return (
    <div className="h-full flex flex-col items-center justify-center py-14 text-center">
      <div className="relative w-56 h-56">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 luopan-spin text-ink"
        >
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.55" />
          <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
          {ticks.map((deg) => {
            const a = ((deg - 90) * Math.PI) / 180;
            const inner = deg % 45 === 0 ? 78 : 85;
            const major = deg % 45 === 0;
            return (
              <line
                key={deg}
                x1={100 + inner * Math.cos(a)}
                y1={100 + inner * Math.sin(a)}
                x2={100 + 96 * Math.cos(a)}
                y2={100 + 96 * Math.sin(a)}
                stroke="currentColor"
                strokeWidth={major ? 0.9 : 0.4}
                opacity={major ? 0.9 : 0.45}
              />
            );
          })}
          {trigrams.map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
              fill="currentColor"
              opacity="0.7"
            >
              {t.g}
            </text>
          ))}
          <circle cx="100" cy="100" r="20" fill="none" stroke="#8b2c1c" strokeWidth="0.9" />
        </svg>

        {/* Fixed needle — the dial turns beneath it as the master aligns. */}
        <svg viewBox="0 0 200 200" className="absolute inset-0">
          <line x1="100" y1="100" x2="100" y2="24" stroke="#8b2c1c" strokeWidth="1.6" />
          <polygon points="100,15 95,29 105,29" fill="#8b2c1c" />
          <circle cx="100" cy="100" r="3.2" fill="#8b2c1c" />
        </svg>
      </div>

      <div className="text-[10px] tracking-[0.35em] uppercase text-muted mt-9 mb-2">
        The master is casting
      </div>
      <div
        key={step}
        className="font-cn text-xl text-ink min-h-[1.7em] ink-bleed"
      >
        {STEPS[step]}
      </div>
    </div>
  );
}
