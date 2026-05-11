"use client";

import { useGoldRates } from "@/hooks/useGoldRates";

export function GoldTicker() {
  const { rates } = useGoldRates();
  const content = [...rates, ...rates];
  return (
    <div className="overflow-hidden rounded-full border border-amber-300 bg-[var(--surface)] py-2">
      <div className="ticker-track gap-6 px-4 text-sm data-font">
        {content.map((rate, i) => (
          <span key={`${rate.purity}-${i}`}>{rate.purity}: ₹{rate.ratePerGram}/g</span>
        ))}
      </div>
    </div>
  );
}
