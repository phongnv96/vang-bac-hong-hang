import { formatVND } from "@/lib/utils";

export { formatVND };

export function fmtPct(val: number | null | undefined): string {
  if (val == null) return "—";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val ? Number(val).toFixed(1) : "0"}%`;
}

export function pnlColor(val: number | null | undefined): string {
  if (val == null) return "text-muted-foreground";
  return val >= 0 ? "text-green-400" : "text-red-400";
}
