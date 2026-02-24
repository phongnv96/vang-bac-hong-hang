import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// POST — kiểm tra username/password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("id, username")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: data.username });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
