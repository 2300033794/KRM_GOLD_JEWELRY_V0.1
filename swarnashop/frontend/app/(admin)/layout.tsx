"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { decodeRole } from "@/lib/auth";

const useLocalStorageValue = (key: string) =>
  useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => callback();
      window.addEventListener("storage", handler);
      window.addEventListener("local-storage", handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener("local-storage", handler);
      };
    },
    () => (typeof window === "undefined" ? null : window.localStorage.getItem(key)),
    () => null,
  );

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = useLocalStorageValue("token");
  const authorized = decodeRole(token ?? "") === "ADMIN";

  if (!authorized) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-[var(--surface)] px-6 py-10 text-center">
        <h1 className="text-2xl text-[var(--foreground)]">Admin Access Required</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Please sign in with an administrator account to manage orders, products, and customers.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--primary-gold)] px-6 py-2 text-sm font-semibold text-black"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-amber-200/40 bg-[var(--background)]/95 px-6 py-4 text-sm text-[var(--muted)]">
          Admin Workspace · Manage gold rates, deliveries, and customer experiences.
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
