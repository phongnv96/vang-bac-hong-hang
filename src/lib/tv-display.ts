import { supabase } from "@/lib/supabase";
import {
  type ChartField,
  type TvDisplaySettings,
  DEFAULT_TV_DISPLAY_SETTINGS,
} from "@/types/tv-display";

const ROW_ID = "default";

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function normalizeTvDisplaySettings(row: Record<string, unknown> | null): TvDisplaySettings {
  if (!row) return { ...DEFAULT_TV_DISPLAY_SETTINGS };

  const chart_days = clampInt(Number(row.chart_days), 1, 365);
  const chart_row_index = clampInt(Number(row.chart_row_index), 0, 50);
  const rawField = String(row.chart_field ?? "sell").toLowerCase();
  const chart_field: ChartField = rawField === "buy" ? "buy" : "sell";
  const slide_interval_sec = clampInt(Number(row.slide_interval_sec), 60, 3600);

  return {
    chart_days: Number.isFinite(chart_days) ? chart_days : DEFAULT_TV_DISPLAY_SETTINGS.chart_days,
    chart_row_index: Number.isFinite(chart_row_index)
      ? chart_row_index
      : DEFAULT_TV_DISPLAY_SETTINGS.chart_row_index,
    chart_field,
    slide_interval_sec: Number.isFinite(slide_interval_sec)
      ? slide_interval_sec
      : DEFAULT_TV_DISPLAY_SETTINGS.slide_interval_sec,
  };
}

export async function fetchTvDisplaySettings(): Promise<TvDisplaySettings> {
  const { data, error } = await supabase
    .from("tv_display_settings")
    .select("chart_days, chart_row_index, chart_field, slide_interval_sec")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error || !data) {
    return { ...DEFAULT_TV_DISPLAY_SETTINGS };
  }

  return normalizeTvDisplaySettings(data as Record<string, unknown>);
}
