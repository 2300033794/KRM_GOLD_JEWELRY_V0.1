"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

const initialOrders = [
  {
    id: "ORD-4391",
    customer: "Ananya Krishnan",
    items: 3,
    total: "₹42,500",
    status: "Out for delivery",
    payment: "Paid",
    date: "12 May 2026",
  },
  {
    id: "ORD-4318",
    customer: "Rahul Menon",
    items: 2,
    total: "₹18,200",
    status: "Delivered",
    payment: "Paid",
    date: "04 May 2026",
  },
  {
    id: "ORD-4282",
    customer: "Keerthana Rao",
    items: 1,
    total: "₹7,950",
    status: "Processing",
    payment: "Pending",
    date: "01 May 2026",
  },
];

const statusOptions = ["Processing", "Crafting", "Shipped", "Out for delivery", "Delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = (id: string, status: string) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  return (
    <PageShell title="Admin Orders">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-[var(--surface)] p-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Pipeline</p>
          <p className="text-lg font-semibold">36 open orders · 12 shipping today</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-xs font-semibold text-black"
        >
          Export CSV
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-amber-200">
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.items}</td>
                <td className="px-4 py-3">{order.total}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-amber-300 px-2 py-1 text-xs">
                    {order.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className="rounded-full border border-amber-300 bg-transparent px-3 py-1 text-xs"
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { label: "Awaiting Payment", value: "4" },
          { label: "Crafting Queue", value: "9" },
          { label: "Ready to Ship", value: "7" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-amber-200 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
