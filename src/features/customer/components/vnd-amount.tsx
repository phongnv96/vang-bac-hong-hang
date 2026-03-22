"use client";

import { cn, formatVND } from "@/lib/utils";

type Props = {
  value: string | number | null | undefined;
  /** Outer wrapper — use for size/weight/color on the whole amount */
  className?: string;
  /** Suffix (₫) — default muted; set e.g. `text-foreground` when parent sets PnL color */
  suffixClassName?: string;
};

/**
 * VNĐ display: lining + tabular figures, explicit sans, no underline on ₫
 * (avoids “đ/₫” looking serif or link-styled in some fonts).
 */
export function VndAmount({
  value,
  className,
  suffixClassName,
}: Props) {
  const core = formatVND(value);
  if (core === "—") {
    return <span className={className}>—</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-baseline font-sans decoration-transparent",
        "[font-variant-numeric:lining-nums_tabular-nums]",
        "no-underline",
        className
      )}
    >
      <span className="min-w-0 tabular-nums">{core}</span>
      <span
        className={cn(
          "shrink-0 font-sans text-[0.88em] font-medium tabular-nums no-underline",
          "[font-variant-numeric:lining-nums_tabular-nums]",
          "decoration-transparent",
          suffixClassName ?? "text-muted-foreground/85"
        )}
        aria-hidden
      >
        {"\u202f₫"}
      </span>
    </span>
  );
}
