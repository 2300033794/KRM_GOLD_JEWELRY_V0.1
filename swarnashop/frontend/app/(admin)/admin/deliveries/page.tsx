"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

type Delivery = {
  id: string;
  orderId: string;
  courier: string;
  tracking: string;
  status: string;
  eta: string;
};

const initialDeliveries: Delivery[] = [
  {
    id: "DEL-2201",
    orderId: "ORD-4391",
    courier: "BlueDart",
    tracking: "BLR9842T1",
    status: "Out for delivery",
    eta: "13 May 2026",
  },
  {
    id: "DEL-2184",
    orderId: "ORD-4318",
    courier: "Delhivery",
    tracking: "DLV5281P7",
    status: "Delivered",
    eta: "05 May 2026",
  },
  {
    id: "DEL-2172",
    orderId: "ORD-4282",
    courier: "DHL",
    tracking: "DHL4728K3",
    status: "Processing",
    eta: "15 May 2026",
  },
];

const statusOptions = ["Processing", "Packed", "Shipped", "Out for delivery", "Delivered"];

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Delivery | null>(null);

  const startEdit = (delivery: Delivery) => {
    setEditingId(delivery.id);
    setDraft(delivery);
  };

  const saveEdit = () => {
    if (!draft) return;
    setDeliveries((current) => current.map((item) => (item.id === draft.id ? draft : item)));
    setEditingId(null);
    setDraft(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  return (
    <PageShell title="Admin Deliveries">
      <div className="rounded-2xl border border-amber-200 bg-[var(--surface)] p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Delivery Control
        </p>
        <p className="text-lg font-semibold">
          5 consignments out for delivery · 2 pending pickup
        </p>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Courier</th>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">ETA</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => {
              const editing = editingId === delivery.id;
              return (
                <tr key={delivery.id} className="border-t border-amber-200">
                  <td className="px-4 py-3 font-semibold">{delivery.id}</td>
                  <td className="px-4 py-3">{delivery.orderId}</td>
                  <td className="px-4 py-3">
                    {editing ? (
                      <input
                        value={draft?.courier ?? ""}
                        onChange={(event) =>
                          setDraft((current) => (current ? { ...current, courier: event.target.value } : null))
                        }
                        className="w-full rounded-lg border border-amber-200 bg-transparent px-2 py-1 text-xs"
                      />
                    ) : (
                      delivery.courier
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editing ? (
                      <input
                        value={draft?.tracking ?? ""}
                        onChange={(event) =>
                          setDraft((current) => (current ? { ...current, tracking: event.target.value } : null))
                        }
                        className="w-full rounded-lg border border-amber-200 bg-transparent px-2 py-1 text-xs"
                      />
                    ) : (
                      delivery.tracking
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editing ? (
                      <select
                        value={draft?.status ?? delivery.status}
                        onChange={(event) =>
                          setDraft((current) => (current ? { ...current, status: event.target.value } : null))
                        }
                        className="rounded-full border border-amber-300 bg-transparent px-3 py-1 text-xs"
                      >
                        {statusOptions.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-full border border-amber-300 px-3 py-1 text-xs">
                        {delivery.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editing ? (
                      <input
                        value={draft?.eta ?? ""}
                        onChange={(event) =>
                          setDraft((current) => (current ? { ...current, eta: event.target.value } : null))
                        }
                        className="w-full rounded-lg border border-amber-200 bg-transparent px-2 py-1 text-xs"
                      />
                    ) : (
                      delivery.eta
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editing ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="rounded-full bg-[var(--primary-gold)] px-3 py-1 text-xs font-semibold text-black"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-amber-300 px-3 py-1 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(delivery)}
                        className="rounded-full border border-amber-300 px-3 py-1 text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
