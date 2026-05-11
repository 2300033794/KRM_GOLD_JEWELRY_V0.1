import { PageShell } from "@/components/layout/page-shell";

export default function ShopPage() {
  return (
    <PageShell title="Shop Jewellery">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-amber-200 p-3 text-sm">Filters: category, purity, weight, price, stock</aside>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <article key={i} className="rounded-xl border border-amber-200 p-3 transition hover:scale-[1.01] hover:shadow-lg">Product {i + 1}</article>)}</div>
      </div>
    </PageShell>
  );
}
