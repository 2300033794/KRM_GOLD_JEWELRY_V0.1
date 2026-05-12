"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

type RateEntry = {
  date: string;
  kt24: string;
  kt22: string;
  kt18: string;
  notes: string;
};

const initialHistory: RateEntry[] = [
  { date: "12 May 2026", kt24: "₹7,640", kt22: "₹7,006", kt18: "₹5,730", notes: "Market bullish" },
  { date: "11 May 2026", kt24: "₹7,580", kt22: "₹6,940", kt18: "₹5,680", notes: "Slight dip" },
  { date: "10 May 2026", kt24: "₹7,600", kt22: "₹6,970", kt18: "₹5,710", notes: "Stable" },
];

export default function AdminRates() {
  const [form, setForm] = useState({ kt24: "", kt22: "", kt18: "", notes: "" });
  const [history, setHistory] = useState(initialHistory);

  const handlePublish = () => {
    const entry: RateEntry = {
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      kt24: form.kt24 || "₹0",
      kt22: form.kt22 || "₹0",
      kt18: form.kt18 || "₹0",
      notes: form.notes || "Updated",
    };
    setHistory((current) => [entry, ...current]);
    setForm({ kt24: "", kt22: "", kt18: "", notes: "" });
  };

  return (
    <PageShell title="Gold Rates Management">
      <section className="rounded-2xl border border-amber-200 bg-[var(--surface)] p-5 text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Update Rates</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input
            value={form.kt24}
            onChange={(event) => setForm((current) => ({ ...current, kt24: event.target.value }))}
            placeholder="24KT (₹/g)"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.kt22}
            onChange={(event) => setForm((current) => ({ ...current, kt22: event.target.value }))}
            placeholder="22KT (₹/g)"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.kt18}
            onChange={(event) => setForm((current) => ({ ...current, kt18: event.target.value }))}
            placeholder="18KT (₹/g)"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Notes"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handlePublish}
          className="mt-4 rounded-full bg-[var(--primary-gold)] px-5 py-2 text-xs font-semibold text-black"
        >
          Publish Rates
        </button>
      </section>
      <section className="mt-6 rounded-2xl border border-amber-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Rate History</p>
            <h2 className="text-xl text-[var(--foreground)]">Last 7 Updates</h2>
          </div>
          <span className="rounded-full border border-amber-200 px-3 py-1 text-xs text-[var(--muted)]">
            Auto-synced
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-amber-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">24KT</th>
                <th className="px-4 py-3">22KT</th>
                <th className="px-4 py-3">18KT</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.date} className="border-t border-amber-200">
                  <td className="px-4 py-3 font-semibold">{entry.date}</td>
                  <td className="px-4 py-3">{entry.kt24}</td>
                  <td className="px-4 py-3">{entry.kt22}</td>
                  <td className="px-4 py-3">{entry.kt18}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
