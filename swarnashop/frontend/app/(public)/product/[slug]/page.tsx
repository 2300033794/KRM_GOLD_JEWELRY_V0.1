import { PageShell } from "@/components/layout/page-shell";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PageShell title={`Product: ${slug}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface rounded-xl p-4">Image gallery + zoom</div>
        <div className="space-y-2 rounded-xl border border-amber-200 p-4">Price breakdown, quantity selector, add to cart, buy now</div>
      </div>
    </PageShell>
  );
}
