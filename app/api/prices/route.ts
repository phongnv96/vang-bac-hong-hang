import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_PRICES } from "@/configs/prices";
import { getCalendarDateString } from "@/lib/prices-date";

function getTodayDate(): string {
  return getCalendarDateString();
}

// GET — lấy giá ngày hôm nay
export async function GET() {
  try {
    const today = getTodayDate();

    const { data, error } = await supabase
      .from("gold_prices")
      .select("prices")
      .eq("date", today)
      .single();

    if (error || !data) {
      // Chưa có giá ngày hôm nay → trả về default với buy/sell rỗng
      const empty = DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
      return NextResponse.json({ prices: empty, date: today, exists: false });
    }

    return NextResponse.json({ prices: data.prices, date: today, exists: true });
  } catch (error) {
    console.error("[GET /api/prices] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — lưu/cập nhật giá ngày hôm nay
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prices } = body;

    if (!prices || !Array.isArray(prices)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const today = getTodayDate();

    // Upsert: insert hoặc update nếu đã tồn tại
    const { error } = await supabase
      .from("gold_prices")
      .upsert(
        { date: today, prices, updated_at: new Date().toISOString() },
        { onConflict: "date" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: snapErr } = await supabase.from("gold_price_snapshots").insert({
      prices,
      recorded_at: new Date().toISOString(),
    });

    if (snapErr) {
      console.error("[POST /api/prices] snapshot insert:", snapErr);
    }

    return NextResponse.json({ success: true, date: today });
  } catch (error) {
    console.error("[POST /api/prices] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
