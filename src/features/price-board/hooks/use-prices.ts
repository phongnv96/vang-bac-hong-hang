"use client";

import { useState, useEffect } from "react";
import { type PriceRow } from "@/types/prices";
import { DEFAULT_PRICES, STORAGE_KEY } from "@/configs/prices";
import { loadPrices } from "@/lib/prices";

export function usePrices(refreshInterval = 30000) {
  const [prices, setPrices] = useState<PriceRow[]>(
    DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }))
  );

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        if (data.prices) setPrices(data.prices);
      } catch {
        // Fallback — giữ nguyên defaults
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return prices;
}
