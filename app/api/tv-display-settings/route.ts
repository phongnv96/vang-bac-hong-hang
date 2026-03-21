import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { fetchTvDisplaySettings, normalizeTvDisplaySettings } from "@/lib/tv-display";

const patchSchema = z.object({
  chart_days: z.number().int().min(1).max(365).optional(),
  chart_row_index: z.number().int().min(0).max(50).optional(),
  chart_field: z.enum(["buy", "sell"]).optional(),
  slide_interval_sec: z.number().int().min(60).max(3600).optional(),
});

export async function GET() {
  try {
    const settings = await fetchTvDisplaySettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[GET /api/tv-display-settings] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const current = await fetchTvDisplaySettings();
    const next = {
      chart_days: parsed.data.chart_days ?? current.chart_days,
      chart_row_index: parsed.data.chart_row_index ?? current.chart_row_index,
      chart_field: parsed.data.chart_field ?? current.chart_field,
      slide_interval_sec: parsed.data.slide_interval_sec ?? current.slide_interval_sec,
    };

    const normalized = normalizeTvDisplaySettings({
      chart_days: next.chart_days,
      chart_row_index: next.chart_row_index,
      chart_field: next.chart_field,
      slide_interval_sec: next.slide_interval_sec,
    });

    const { error } = await supabase.from("tv_display_settings").upsert(
      {
        id: "default",
        chart_days: normalized.chart_days,
        chart_row_index: normalized.chart_row_index,
        chart_field: normalized.chart_field,
        slide_interval_sec: normalized.slide_interval_sec,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: normalized });
  } catch (error) {
    console.error("[POST /api/tv-display-settings] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
