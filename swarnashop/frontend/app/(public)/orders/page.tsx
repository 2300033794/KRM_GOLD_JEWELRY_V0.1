import clsx from "clsx";
import { PageShell } from "@/components/layout/page-shell";

const orders = [
  {
    id: "ORD-4391",
    date: "12 May 2026",
    total: "₹42,500",
    status: "Out for delivery",
    items: ["Temple Pendant", "Gold Chain 22KT"],
    timeline: [
      { label: "Order placed", date: "10 May" },
      { label: "Crafting in progress", date: "11 May" },
      { label: "Quality check", date: "12 May" },
      { label: "Out for delivery", date: "13 May" },
    ],
    currentStep: 3,
  },
  {
    id: "ORD-4318",
    date: "04 May 2026",
    total: "₹18,200",
    status: "Delivered",
    items: ["Bangle Pair", "Nose Pin"],
    timeline: [
      { label: "Order placed", date: "02 May" },
      { label: "Crafting in progress", date: "03 May" },
      { label: "Shipped", date: "04 May" },
      { label: "Delivered", date: "05 May" },
    ],
    currentStep: 3,
  },
];

export default function OrdersPage() {
  return (
    <PageShell title="My Orders">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active Orders", value: "1" },
          { label: "Delivered Orders", value: "12" },
          { label: "Total Savings", value: "₹9,860" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-amber-200 bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-amber-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[var(--muted)]">Order ID</p>
                <p className="text-lg font-semibold">{order.id}</p>
                <p className="text-xs text-[var(--muted)]">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">Total</p>
                <p className="text-lg font-semibold">{order.total}</p>
                <span className="rounded-full border border-amber-300 px-3 py-1 text-xs text-[var(--deep-gold)]">
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-xl bg-[var(--surface)] p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Items
                </p>
                <ul className="mt-2 space-y-1">
                  {order.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[var(--muted)]">
                  Delivery Partner: BlueDart · Tracking ID: BLR9842T1
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Delivery Timeline
                </p>
                <div className="mt-3 space-y-3">
                  {order.timeline.map((step, index) => (
                    <div key={step.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={clsx(
                            "h-3 w-3 rounded-full",
                            index <= order.currentStep
                              ? "bg-[var(--primary-gold)]"
                              : "bg-amber-200",
                          )}
                        />
                        {index < order.timeline.length - 1 ? (
                          <span className="h-6 w-px bg-amber-200" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {step.label}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
