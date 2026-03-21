import { parseVND } from "@/lib/utils";
import { type PriceRow } from "@/types/prices";
import { calendarDateKeyFromDate, getCalendarDateString } from "@/lib/prices-date";

export interface SnapshotRow {
  recorded_at: string;
  prices: unknown;
}

export interface GoldPriceDayRow {
  date: string;
  prices: unknown;
}

export interface DailyChartPoint {
  date: string;
  value: number;
  label: string;
}

function asPriceRows(prices: unknown): PriceRow[] | null {
  if (!Array.isArray(prices)) return null;
  return prices as PriceRow[];
}

export function extractChartScalar(
  prices: unknown,
  rowIndex: number,
  field: "buy" | "sell"
): number | null {
  const rows = asPriceRows(prices);
  if (!rows) return null;
  const row = rows[rowIndex];
  if (!row) return null;
  const raw = field === "buy" ? row.buy : row.sell;
  if (raw == null || String(raw).trim() === "") return null;
  const digits = parseVND(String(raw));
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function labelDdMm(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
}

function eachCalendarDateKeyInclusive(from: Date, to: Date): string[] {
  const cur = new Date(from);
  cur.setHours(12, 0, 0, 0);
  const end = new Date(to);
  end.setHours(12, 0, 0, 0);
  const out: string[] = [];
  while (cur <= end) {
    out.push(calendarDateKeyFromDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/** Merge gold_prices (per day) + snapshots (last in calendar day wins), then forward-fill within window. */
export function buildDailyChartSeries(params: {
  snapshots: SnapshotRow[];
  goldPriceDays: GoldPriceDayRow[];
  chartDays: number;
  rowIndex: number;
  field: "buy" | "sell";
  /** Extra calendar days before the chart window to seed carry (default 120). */
  lookbackDays?: number;
}): DailyChartPoint[] {
  const { snapshots, goldPriceDays, chartDays, rowIndex, field } = params;
  const lookback = params.lookbackDays ?? 120;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - (chartDays - 1));

  const extStart = new Date(windowStart);
  extStart.setDate(windowStart.getDate() - lookback);

  const dayBeforeWindow = new Date(windowStart);
  dayBeforeWindow.setDate(windowStart.getDate() - 1);

  const byDay = new Map<string, number>();

  const goldSorted = [...goldPriceDays].sort((a, b) => a.date.localeCompare(b.date));
  for (const g of goldSorted) {
    const v = extractChartScalar(g.prices, rowIndex, field);
    if (v !== null) byDay.set(g.date, v);
  }

  const snapsSorted = [...snapshots].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
  for (const s of snapsSorted) {
    const key = calendarDateKeyFromDate(new Date(s.recorded_at));
    const v = extractChartScalar(s.prices, rowIndex, field);
    if (v !== null) byDay.set(key, v);
  }

  let carry: number | null = null;
  for (const d of eachCalendarDateKeyInclusive(extStart, dayBeforeWindow)) {
    if (byDay.has(d)) {
      carry = byDay.get(d)!;
    }
  }

  const windowKeys = eachCalendarDateKeyInclusive(windowStart, today);
  const points: DailyChartPoint[] = [];

  for (const d of windowKeys) {
    if (byDay.has(d)) {
      carry = byDay.get(d)!;
    }
    if (carry !== null) {
      points.push({ date: d, value: carry, label: labelDdMm(d) });
    }
  }

  return points;
}

export function getTodayKey(): string {
  return getCalendarDateString();
}
