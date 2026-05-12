import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";

const quickLinks = [
  { href: "/shop", label: "Shop Collections" },
  { href: "/gold-rates", label: "Live Gold Rates" },
  { href: "/calculator", label: "Gold Calculator" },
  { href: "/orders", label: "Track Orders" },
  { href: "/profile", label: "My Account" },
];

const socials = [
  { href: "https://kmrjewellery.com", label: "Website", icon: Globe },
  { href: "mailto:care@kmrjewellery.com", label: "Email", icon: Mail },
  { href: "tel:+919876543210", label: "Phone", icon: Phone },
];

export function Footer() {
  return (
    <footer className="border-t border-amber-200/40 bg-[var(--surface)] text-sm text-[var(--muted)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg text-[var(--foreground)]">About KMR Jewellery</h3>
          <p>
            Heritage-inspired gold jewellery crafted with BIS hallmarking, live-rate pricing, and
            concierge support for bridal and investment collections.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--deep-gold)]">Since 1984</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg text-[var(--foreground)]">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--deep-gold)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg text-[var(--foreground)]">Connect With Us</h3>
          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 text-[var(--foreground)] transition hover:bg-[var(--primary-gold)] hover:text-black"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
          <div className="text-xs text-[var(--muted)]">
            Support: +91 98765 43210 · care@kmrjewellery.com
          </div>
        </div>
      </div>
      <div className="border-t border-amber-200/40 py-4 text-center text-xs">
        © {new Date().getFullYear()} KMR Jewellery Shop · Purity Certified · BIS Hallmark
      </div>
    </footer>
  );
}
