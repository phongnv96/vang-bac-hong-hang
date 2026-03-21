import { NextResponse } from "next/server";
import { DEFAULT_PRICES } from "@/configs/prices";
import { loadTvChartHistory } from "@/lib/load-tv-chart-payload";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOverride = searchParams.get("days");
    let override: number | undefined;
    if (daysOverride != null) {
      const n = Number(daysOverride);
      if (Number.isFinite(n)) {
        override = Math.min(365, Math.max(1, Math.trunc(n)));
      }
    }

    const { points, chart, settings, chart_days } = await loadTvChartHistory(override);

    const productName =
      DEFAULT_PRICES[settings.chart_row_index]?.name ?? `Dòng ${settings.chart_row_index + 1}`;

    return NextResponse.json({
      points,
      meta: {
        chart_days,
        chart_row_index: settings.chart_row_index,
        chart_field: settings.chart_field,
        productLabel: productName,
        slide_interval_sec: settings.slide_interval_sec,
      },
      chart,
    });
  } catch (error) {
    console.error("[GET /api/prices/history] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
