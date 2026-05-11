"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface GoldRate { purity: string; ratePerGram: number; }

export function useGoldRates() {
  const [rates, setRates] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<GoldRate[]>("/gold-rates/latest")
      .then((res) => setRates(res.data))
      .catch(() => setRates([{ purity: "24KT", ratePerGram: 7600 }, { purity: "22KT", ratePerGram: 6980 }, { purity: "18KT", ratePerGram: 5710 }]))
      .finally(() => setLoading(false));
  }, []);

  return { rates, loading };
}
