import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { DEFAULT_PRICES } from "@/app/lib/prices";

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
  } catch {
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

    return NextResponse.json({ success: true, date: today });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
