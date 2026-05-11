import { GoldTicker } from "@/components/animations/gold-ticker";
import { PageShell } from "@/components/layout/page-shell";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl surface p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#d4af3740,transparent_60%)]" />
        <h1 className="relative text-5xl shimmer-text">KMR JEWELLERY Shop</h1>
        <p className="relative mt-2 max-w-2xl text-[var(--muted)]">Certified gold jewellery with live rates, instant pricing, and secure checkout.</p>
      </section>
      <GoldTicker />
      <div className="overflow-hidden rounded bg-[var(--charcoal)] py-2 text-[var(--ivory)]"><div className="ticker-track">Purity Certified | Hallmark BIS | Free Shipping Above ₹5000 · Purity Certified | Hallmark BIS | Free Shipping Above ₹5000</div></div>
      <PageShell title="Featured Collections">
        <div className="grid gap-4 md:grid-cols-3">{["Bridal", "Daily Wear", "Temple"].map((x) => <article key={x} className="rounded-xl border border-amber-200 p-4 transition hover:scale-[1.01] hover:shadow-lg">{x}</article>)}</div>
      </PageShell>
    </div>
  );
}
