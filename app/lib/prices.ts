export interface PriceRow {
  name: string;
  buy: string;
  sell: string;
}

export const DEFAULT_PRICES: PriceRow[] = [
  { name: "Nhẫn Tròn", buy: "17.000.000", sell: "17.400.000" },
  { name: "Nữ Trang", buy: "16.800.000", sell: "17.300.000" },
  { name: "Vàng Tây 10K", buy: "", sell: "" },
  { name: "Bạc", buy: "", sell: "" },
];

export const STORAGE_KEY = "hong-hang-gold-prices";

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

/** Format số thành tiền VND: 17000000 → "17.000.000" */
export function formatVND(value: string): string {
  // Xóa tất cả ký tự không phải số
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  // Thêm dấu chấm ngăn cách hàng nghìn
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Xóa format về số thuần: "17.000.000" → "17000000" */
export function parseVND(value: string): string {
  return value.replace(/\./g, "");
}
