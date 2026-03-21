import { supabase } from "@/lib/supabase";
import { DEFAULT_PRICES } from "@/configs/prices";
import {
  buildDailyChartSeries,
  type DailyChartPoint,
  type GoldPriceDayRow,
  type SnapshotRow,
} from "@/lib/gold-price-history";
import { fetchTvDisplaySettings } from "@/lib/tv-display";
import { getCalendarDateString } from "@/lib/prices-date";
import type { TvDisplaySettings } from "@/types/tv-display";

export interface TvChartClientPayload {
  labels: string[];
  values: number[];
  title: string;
  slideIntervalSec: number;
  empty: boolean;
}

async function queryHistoryData(chartDays: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowStart = new Date(today);
  windowStart.setDate(today.getDate() - (chartDays - 1));
  const extStart = new Date(windowStart);
  extStart.setDate(windowStart.getDate() - 120);

  const extKey = getCalendarDateString(extStart);
  const todayKey = getCalendarDateString(today);

  const [{ data: snapData, error: snapErr }, { data: goldData, error: goldErr }] = await Promise.all([
    supabase
      .from("gold_price_snapshots")
      .select("recorded_at, prices")
      .gte("recorded_at", extStart.toISOString())
      .order("recorded_at", { ascending: true }),
    supabase
      .from("gold_prices")
      .select("date, prices")
      .gte("date", extKey)
      .lte("date", todayKey)
      .order("date", { ascending: true }),
  ]);

  return {
    snapshots: (snapData ?? []) as SnapshotRow[],
    goldPriceDays: (goldData ?? []) as GoldPriceDayRow[],
    snapErr,
    goldErr,
  };
}

function toClientPayload(
  points: DailyChartPoint[],
  settings: TvDisplaySettings
): TvChartClientPayload {
  const productName =
    DEFAULT_PRICES[settings.chart_row_index]?.name ?? `Dòng ${settings.chart_row_index + 1}`;
  const fieldLabel = settings.chart_field === "buy" ? "Mua vào" : "Bán ra";

  return {
    labels: points.map((p) => p.label),
    values: points.map((p) => p.value),
    title: `${productName} — ${fieldLabel}`,
    slideIntervalSec: settings.slide_interval_sec,
    empty: points.length === 0,
  };
}

export interface TvChartHistoryResult {
  points: DailyChartPoint[];
  chart: TvChartClientPayload;
  settings: TvDisplaySettings;
  chart_days: number;
}

export async function loadTvChartHistory(chartDaysOverride?: number): Promise<TvChartHistoryResult> {
  const settings = await fetchTvDisplaySettings();
  const chartDays =
    chartDaysOverride != null
      ? Math.min(365, Math.max(1, Math.trunc(chartDaysOverride)))
      : settings.chart_days;

  const { snapshots, goldPriceDays, snapErr, goldErr } = await queryHistoryData(chartDays);

  if (snapErr) {
    console.error("[loadTvChartHistory] snapshots:", snapErr);
  }
  if (goldErr) {
    console.error("[loadTvChartHistory] gold_prices:", goldErr);
  }

  const points = buildDailyChartSeries({
    snapshots,
    goldPriceDays,
    chartDays,
    rowIndex: settings.chart_row_index,
    field: settings.chart_field,
  });

  const chart = toClientPayload(points, settings);

  return {
    points,
    chart,
    settings,
    chart_days: chartDays,
  };
}
