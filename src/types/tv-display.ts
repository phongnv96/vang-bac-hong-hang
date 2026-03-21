export type ChartField = "buy" | "sell";

export interface TvDisplaySettings {
  chart_days: number;
  chart_row_index: number;
  chart_field: ChartField;
  slide_interval_sec: number;
}

export const DEFAULT_TV_DISPLAY_SETTINGS: TvDisplaySettings = {
  chart_days: 14,
  chart_row_index: 0,
  chart_field: "sell",
  slide_interval_sec: 300,
};
