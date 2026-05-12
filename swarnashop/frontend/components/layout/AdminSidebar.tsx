"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coins,
  Image,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { href: "/admin/gold-rates", label: "Gold Rates", icon: Coins },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/images", label: "Images", icon: Image },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-amber-200/40 bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-amber-200/40 px-5 py-4">
        <span className="rounded-full bg-[var(--primary-gold)] px-2 py-1 text-xs font-semibold text-black">
          KMR
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Admin Panel</p>
          <p className="text-xs text-[var(--muted)]">Operations Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                active
                  ? "bg-[var(--primary-gold)] text-black"
                  : "text-[var(--muted)] hover:bg-amber-100/60 hover:text-[var(--foreground)]",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-amber-200/40 px-5 py-4 text-xs text-[var(--muted)]">
        Secure access · Logged in as Admin
      </div>
    </aside>
  );
}
