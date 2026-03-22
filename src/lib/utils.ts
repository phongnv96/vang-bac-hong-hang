import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Keep only digits from a VNĐ input string, preserving a leading minus.
 * Handles grouped input like "15.600.000" → "15600000" and "-1.600.000" → "-1600000".
 */
export function parseVND(input: string): string {
  const t = input.trim();
  if (!t) return "";
  const neg = /^[-\u2212]/.test(t);
  const digitsOnly = t.replace(/^[-\u2212]+/u, "").replace(/\D/g, "");
  if (!digitsOnly) return "";
  return neg ? `-${digitsOnly}` : digitsOnly;
}

/** Parse typed/pasted price (e.g. "14.000.000", "14000000", or "1.6E+7") to integer VNĐ. */
export function parseVNDToNumber(input: string): number {
  const t = input.trim();
  if (/e/i.test(t)) {
    const n = Number(t);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }
  const digits = parseVND(input);
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Format a VNĐ amount for display (vi-VN grouping: 16.607.000).
 * Accepts numbers, integer strings, JSON-style decimals ("15600000.00"), or
 * grouped / pasted input ("15.600.000"), or scientific strings ("1.600E+7").
 * Rounds to whole đồng.
 */
export function formatVND(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("vi-VN").format(Math.round(value));
  }

  const s = String(value).trim();
  if (!s) return "—";

  // Some backends serialize Decimals as scientific notation strings
  if (/e/i.test(s)) {
    const n = Number(s);
    if (Number.isFinite(n)) {
      return new Intl.NumberFormat("vi-VN").format(Math.round(n));
    }
    return "—";
  }

  // Plain integer string (incl. negative)
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (!Number.isFinite(n)) return "—";
    return new Intl.NumberFormat("vi-VN").format(Math.round(n));
  }

  // Single-dot decimals from JSON/Decimal ("15600000.00", "-1600.5") — not VN thousand groups
  if (/^-?\d+\.\d+$/.test(s)) {
    const frac = s.split(".")[1] ?? "";
    if (frac.length <= 2) {
      const n = Number(s);
      if (!Number.isFinite(n)) return "—";
      return new Intl.NumberFormat("vi-VN").format(Math.round(n));
    }
  }

  const grouped = parseVND(s);
  if (!grouped) return "—";
  const n = Number(grouped);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}

