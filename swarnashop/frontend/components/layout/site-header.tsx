"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gold-rates", label: "Gold Rates" },
  { href: "/calculator", label: "Calculator" },
  { href: "/admin/dashboard", label: "Admin" },
];

export function SiteHeader() {
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-amber-200/40 bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold shimmer-text">KMR Jewellery</Link>
        <nav className="hidden gap-4 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--deep-gold)]">{link.label}</Link>
          ))}
        </nav>
        <button type="button" onClick={toggle} className="rounded-full border border-amber-300 p-2">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
