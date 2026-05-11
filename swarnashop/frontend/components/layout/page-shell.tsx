import type { ReactNode } from "react";

export function PageShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="reveal space-y-4">
      <h1 className="text-3xl shimmer-text">{title}</h1>
      {children}
    </section>
  );
}
