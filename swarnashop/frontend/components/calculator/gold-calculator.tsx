"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGoldRates } from "@/hooks/useGoldRates";
import { calculateGoldPrice } from "@/lib/goldCalc";
import { formatCurrency } from "@/lib/format";

const schema = z.object({
  purity: z.enum(["24KT", "22KT", "18KT"]),
  weightGrams: z.number().positive(),
  goldRatePerGram: z.number().positive(),
  makingChargePerc: z.number().min(0),
  wastagePerc: z.number().min(0),
  gstPerc: z.number().min(0),
});

type FormValues = z.infer<typeof schema>;

export function GoldCalculator() {
  const { rates } = useGoldRates();
  const [debounced, setDebounced] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      purity: "22KT",
      weightGrams: 10,
      goldRatePerGram: 6980,
      makingChargePerc: 8,
      wastagePerc: 3,
      gstPerc: 3,
    },
  });

  const values = form.watch();

  useEffect(() => {
    const selected = rates.find((r) => r.purity === values.purity);
    if (selected) form.setValue("goldRatePerGram", selected.ratePerGram);
  }, [rates, values.purity, form]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(values), 300);
    return () => clearTimeout(timer);
  }, [values]);

  const result = useMemo(() => {
    if (!debounced) return null;
    return calculateGoldPrice(debounced);
  }, [debounced]);

  return (
    <div className="grid gap-4 rounded-2xl border border-amber-200 p-4 md:grid-cols-2">
      <div className="grid gap-2">
        <label className="text-sm">Purity<select {...form.register("purity")} className="mt-1 w-full rounded border p-2"><option>24KT</option><option>22KT</option><option>18KT</option></select></label>
        <label className="text-sm">Weight (g)<input type="number" step="0.1" {...form.register("weightGrams", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" /></label>
        <label className="text-sm">Rate / g<input type="number" step="0.1" {...form.register("goldRatePerGram", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" /></label>
        <label className="text-sm">Making %<input type="number" step="0.1" {...form.register("makingChargePerc", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" /></label>
        <label className="text-sm">Wastage %<input type="number" step="0.1" {...form.register("wastagePerc", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" /></label>
        <label className="text-sm">GST %<input type="number" step="0.1" {...form.register("gstPerc", { valueAsNumber: true })} className="mt-1 w-full rounded border p-2" /></label>
      </div>
      <div className="surface rounded-xl p-4">
        <h3 className="mb-2 text-xl">Price Breakdown</h3>
        {result ? (
          <table className="w-full text-sm">
            <tbody>
              <tr><td>Gold Value</td><td className="text-right">{formatCurrency(result.goldValue)}</td></tr>
              <tr><td>Making Charges</td><td className="text-right">{formatCurrency(result.makingAmt)}</td></tr>
              <tr><td>Wastage</td><td className="text-right">{formatCurrency(result.wastageAmt)}</td></tr>
              <tr><td>Subtotal</td><td className="text-right">{formatCurrency(result.subtotal)}</td></tr>
              <tr><td>GST</td><td className="text-right">{formatCurrency(result.gstAmt)}</td></tr>
              <tr className="font-semibold"><td>FINAL PRICE</td><td className="text-right">{formatCurrency(result.finalPrice)}</td></tr>
            </tbody>
          </table>
        ) : <div className="skeleton h-24 rounded" />}
      </div>
    </div>
  );
}
