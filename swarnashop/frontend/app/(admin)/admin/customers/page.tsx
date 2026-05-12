"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

type Customer = {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: "Active" | "Inactive";
  orders: number;
};

const initialCustomers: Customer[] = [
  {
    id: "CUS-1102",
    name: "Ananya Krishnan",
    email: "ananya@kmrjewellery.com",
    tier: "Gold Plus",
    status: "Active",
    orders: 14,
  },
  {
    id: "CUS-1038",
    name: "Rahul Menon",
    email: "rahul.menon@gmail.com",
    tier: "Silver",
    status: "Active",
    orders: 7,
  },
  {
    id: "CUS-0994",
    name: "Keerthana Rao",
    email: "keerthana.rao@gmail.com",
    tier: "Platinum",
    status: "Inactive",
    orders: 3,
  },
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);

  const toggleStatus = (id: string) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id
          ? { ...customer, status: customer.status === "Active" ? "Inactive" : "Active" }
          : customer,
      ),
    );
  };

  return (
    <PageShell title="Customers Management">
      <div className="rounded-2xl border border-amber-200 bg-[var(--surface)] p-4 text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Customer Insights</p>
        <p className="text-lg font-semibold">248 active customers · 32 loyalty upgrades</p>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-amber-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-amber-200">
                <td className="px-4 py-3 font-semibold">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.tier}</td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-amber-300 px-3 py-1 text-xs">
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(customer.id)}
                    className="rounded-full border border-amber-300 px-3 py-1 text-xs"
                  >
                    {customer.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
