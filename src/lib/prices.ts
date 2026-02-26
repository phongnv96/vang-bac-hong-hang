import { type PriceRow } from "@/types/prices";
import { DEFAULT_PRICES, STORAGE_KEY } from "@/configs/prices";

export function loadPrices(): PriceRow[] {
  if (typeof window === "undefined") return DEFAULT_PRICES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_PRICES;
}

export function savePrices(prices: PriceRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
}
