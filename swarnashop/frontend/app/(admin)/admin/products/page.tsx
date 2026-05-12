"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  active: boolean;
  imageName?: string;
};

const initialProducts: Product[] = [
  {
    id: "PRD-902",
    name: "Temple Pendant Set",
    category: "Necklace",
    price: "₹24,500",
    stock: 12,
    active: true,
    imageName: "temple-pendant.jpg",
  },
  {
    id: "PRD-885",
    name: "Bridal Bangle Pair",
    category: "Bangles",
    price: "₹38,200",
    stock: 6,
    active: true,
    imageName: "bridal-bangle.jpg",
  },
  {
    id: "PRD-861",
    name: "Classic Nose Pin",
    category: "Accessories",
    price: "₹4,200",
    stock: 30,
    active: false,
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newProduct: Product = {
      id: `PRD-${Math.floor(Math.random() * 900 + 100)}`,
      name: form.name,
      category: form.category || "General",
      price: form.price || "₹0",
      stock: Number(form.stock || 0),
      active: true,
    };
    setProducts((current) => [newProduct, ...current]);
    setForm({ name: "", category: "", price: "", stock: "" });
  };

  const toggleActive = (id: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product,
      ),
    );
  };

  const removeProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const updateImage = (id: string, imageName: string) => {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, imageName } : product)),
    );
  };

  return (
    <PageShell title="Admin Products">
      <section className="rounded-2xl border border-amber-200 bg-[var(--surface)] p-5 text-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Add Product</p>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Product name"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            placeholder="Category"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            placeholder="Price (₹)"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
          <input
            value={form.stock}
            onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
            placeholder="Stock"
            className="rounded-xl border border-amber-200 bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 rounded-full bg-[var(--primary-gold)] px-5 py-2 text-xs font-semibold text-black"
        >
          Add Product
        </button>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-amber-200 p-4 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--muted)]">{product.category}</p>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{product.name}</h3>
                <p className="mt-1 text-sm">{product.price}</p>
                <p className="text-xs text-[var(--muted)]">Stock: {product.stock}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(product.id)}
                className="rounded-full border border-amber-300 px-3 py-1 text-xs"
              >
                {product.active ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="mt-4 rounded-xl bg-[var(--surface)] p-3 text-xs">
              <p className="text-[var(--muted)]">Image</p>
              <p className="mt-1 text-[var(--foreground)]">
                {product.imageName ? product.imageName : "No image uploaded"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="rounded-full border border-amber-300 px-3 py-1 text-xs">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      updateImage(product.id, event.target.files?.[0]?.name ?? "uploaded-image.jpg")
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => updateImage(product.id, "")}
                  className="rounded-full border border-amber-300 px-3 py-1 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="rounded-full border border-amber-300 px-3 py-1 text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="rounded-full border border-amber-300 px-3 py-1 text-xs"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
