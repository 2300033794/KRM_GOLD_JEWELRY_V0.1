import { PageShell } from "@/components/layout/page-shell";
export default function AdminDashboard(){return <PageShell title="Admin Dashboard"><div className="grid gap-3 md:grid-cols-3">{["Orders","Revenue","Deliveries"].map((x)=><div key={x} className="rounded-xl border border-amber-200 p-3">{x}</div>)}</div></PageShell>;}
