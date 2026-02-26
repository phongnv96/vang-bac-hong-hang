import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without conflicts.
 * Standard utility for shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
