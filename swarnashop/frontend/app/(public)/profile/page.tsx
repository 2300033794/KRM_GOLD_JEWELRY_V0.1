import { PageShell } from "@/components/layout/page-shell";

const addresses = [
  {
    label: "Home",
    name: "Ananya Krishnan",
    line1: "24/7, Lotus Street",
    line2: "T Nagar, Chennai 600017",
    phone: "+91 98765 12345",
  },
  {
    label: "Office",
    name: "Ananya Krishnan",
    line1: "9th Floor, Orion Towers",
    line2: "MG Road, Bengaluru 560001",
    phone: "+91 98765 78901",
  },
];

export default function ProfilePage() {
  return (
    <PageShell title="Profile">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="space-y-4 rounded-2xl border border-amber-200 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Customer Details
            </p>
            <h2 className="text-2xl text-[var(--foreground)]">Ananya Krishnan</h2>
            <p className="text-sm text-[var(--muted)]">Gold Plus Member · Since 2021</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Full Name
              <input
                className="mt-2 w-full rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
                defaultValue="Ananya Krishnan"
              />
            </label>
            <label className="text-sm">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
                defaultValue="ananya@kmrjewellery.com"
              />
            </label>
            <label className="text-sm">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
                defaultValue="+91 98765 12345"
              />
            </label>
            <label className="text-sm">
              Preferred Store
              <select className="mt-2 w-full rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm">
                <option>Chennai · T Nagar</option>
                <option>Bengaluru · MG Road</option>
                <option>Hyderabad · Jubilee Hills</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className="rounded-full bg-[var(--primary-gold)] px-6 py-2 text-sm font-semibold text-black"
          >
            Save Changes
          </button>
        </section>
        <section className="space-y-4 rounded-2xl border border-amber-200 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Loyalty</p>
            <h2 className="text-2xl text-[var(--foreground)]">KMR Gold Plus</h2>
          </div>
          <div className="rounded-xl bg-[var(--surface)] p-4 text-sm">
            <p className="text-xs text-[var(--muted)]">Current Points</p>
            <p className="text-3xl font-semibold">18,450</p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Redeemable on the next purchase above ₹20,000.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Security
            </p>
            <p className="mt-2 text-[var(--foreground)]">Last password update: 12 Apr 2026</p>
            <button
              type="button"
              className="mt-3 rounded-full border border-amber-300 px-4 py-2 text-xs"
            >
              Update Password
            </button>
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-2xl border border-amber-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Address Book
            </p>
            <h2 className="text-2xl text-[var(--foreground)]">Saved Addresses</h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-xs font-semibold text-black"
          >
            Add New Address
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.label} className="rounded-xl bg-[var(--surface)] p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {address.label}
              </p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">{address.name}</p>
              <p>{address.line1}</p>
              <p>{address.line2}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{address.phone}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="rounded-full border border-amber-300 px-3 py-1 text-xs">
                  Edit
                </button>
                <button type="button" className="rounded-full border border-amber-300 px-3 py-1 text-xs">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
