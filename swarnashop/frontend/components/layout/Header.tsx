"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, ShoppingBag, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import clsx from "clsx";
import { useGoldRates } from "@/hooks/useGoldRates";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gold-rates", label: "Gold Rates" },
  { href: "/calculator", label: "Calculator" },
  { href: "/orders", label: "Orders" },
  { href: "/profile", label: "Profile" },
];

const fallbackRates = [
  { purity: "24KT", ratePerGram: 7600 },
  { purity: "22KT", ratePerGram: 6980 },
  { purity: "18KT", ratePerGram: 5710 },
];

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

export function Header() {
  const pathname = usePathname();
  const { rates } = useGoldRates();
  const theme = useLocalStorageValue("theme");
  const cartCountValue = useLocalStorageValue("cartCount");
  const dark = theme === "dark";
  const cartCount = Number.isFinite(Number(cartCountValue)) ? Number(cartCountValue) : 0;

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const displayRates = rates.length ? rates : fallbackRates;

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "light";
    window.localStorage.setItem("theme", next);
    window.dispatchEvent(new Event("local-storage"));
  };

  return (
    <header className="sticky top-0 z-30">
      <div className="border-b border-amber-200/40 bg-[var(--charcoal)] text-[var(--ivory)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--primary-gold)]">
              Live Gold
            </span>
            <div className="flex flex-wrap gap-3 data-font">
              {displayRates.map((rate) => (
                <span key={rate.purity}>
                  {rate.purity}: ₹{rate.ratePerGram}/g
                </span>
              ))}
            </div>
          </div>
          <Link href="/gold-rates" className="text-[var(--primary-gold)] hover:text-white">
            View rates →
          </Link>
        </div>
      </div>
      <div className="border-b border-amber-200/40 bg-[var(--background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden>
              <defs>
                <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f4d03f" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#gold-gradient)" opacity="0.2" />
              <path
                d="M20 36L32 16l12 20H20z"
                fill="url(#gold-gradient)"
                stroke="#b8860b"
                strokeWidth="2"
              />
            </svg>
            <span className="hidden sm:inline">KMR Jewellery</span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-sm transition-colors",
                    active ? "text-[var(--deep-gold)]" : "text-[var(--muted)] hover:text-[var(--deep-gold)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 text-[var(--foreground)]"
              aria-label="View cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -right-1 -top-1 rounded-full bg-[var(--primary-gold)] px-1.5 py-0.5 text-[10px] font-semibold text-black">
                {cartCount}
              </span>
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-amber-200 p-2"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
