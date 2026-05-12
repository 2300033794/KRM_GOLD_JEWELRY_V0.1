"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageShell } from "@/components/layout/page-shell";
import { useGoldRates } from "@/hooks/useGoldRates";

const chartData = [
  { day: "Mon", "24KT": 7580, "22KT": 6940 },
  { day: "Tue", "24KT": 7605, "22KT": 6968 },
  { day: "Wed", "24KT": 7612, "22KT": 6975 },
  { day: "Thu", "24KT": 7598, "22KT": 6952 },
  { day: "Fri", "24KT": 7624, "22KT": 6990 },
  { day: "Sat", "24KT": 7640, "22KT": 7006 },
  { day: "Sun", "24KT": 7628, "22KT": 6995 },
];

export default function RatesPage() {
  const { rates } = useGoldRates();
  const displayRates = rates.length ? rates : fallbackRates;
  const lastUpdated = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <PageShell title="Gold Rates">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                7-Day Trend
              </p>
              <h2 className="text-xl text-[var(--foreground)]">Live Gold Rate Movement</h2>
            </div>
            <p className="text-xs text-[var(--muted)]">Updated {lastUpdated}</p>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5d8b5" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="24KT" stroke="#b8860b" strokeWidth={2} />
                <Line type="monotone" dataKey="22KT" stroke="#d4af37" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Today&apos;s Rates
          </p>
          <h2 className="text-xl text-[var(--foreground)]">Per Gram Pricing</h2>
          <div className="mt-4 space-y-3">
            {displayRates.map((rate) => (
              <div
                key={rate.purity}
                className="flex items-center justify-between rounded-xl bg-[var(--surface)] px-4 py-3 text-sm"
              >
                <span className="font-semibold">{rate.purity}</span>
                <span className="data-font">₹{rate.ratePerGram}/g</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-amber-200/60 p-4 text-xs text-[var(--muted)]">
            GST and making charges apply based on design. Use the calculator for final price
            estimates.
          </div>
        </div>
      </div>
      <section className="mt-6 rounded-2xl border border-amber-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Latest Rate Table
            </p>
            <h2 className="text-xl text-[var(--foreground)]">Purity Breakdown</h2>
          </div>
          <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
            Last updated {lastUpdated}
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-amber-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Purity</th>
                <th className="px-4 py-3">Rate / gram</th>
                <th className="px-4 py-3">Daily Change</th>
              </tr>
            </thead>
            <tbody>
              {displayRates.map((rate) => (
                <tr key={rate.purity} className="border-t border-amber-200">
                  <td className="px-4 py-3 font-semibold">{rate.purity}</td>
                  <td className="px-4 py-3 data-font">₹{rate.ratePerGram}</td>
                  <td className="px-4 py-3 text-[var(--success)]">+0.4%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

const fallbackRates = [
  { purity: "24KT", ratePerGram: 7640 },
  { purity: "22KT", ratePerGram: 7006 },
  { purity: "18KT", ratePerGram: 5730 },
];
