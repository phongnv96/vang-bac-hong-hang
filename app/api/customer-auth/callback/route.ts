import { NextResponse } from "next/server";

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:8001/api/v1";

/**
 * POST /api/customer-auth/callback
 * Body: { access_token: string }
 *
 * 1. Takes the Supabase access_token provided by the client
 * 2. Sends it to the backend for JWT exchange
 * 3. Sets the backend JWT as an httpOnly cookie
 */
export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    // Exchange Supabase token for backend JWT
    const backendRes = await fetch(`${backendApiUrl}/customer-auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token }),
    });

    if (!backendRes.ok) {
      console.error("Backend login failed:", await backendRes.text());
      return NextResponse.json({ error: "Backend auth failed" }, { status: backendRes.status });
    }

    const backendData = await backendRes.json();
    const loginResult = backendData.data ?? backendData;

    const response = NextResponse.json({ success: true });

    // Set backend JWT as httpOnly cookie
    response.cookies.set("customer_token", loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Store non-sensitive profile info in a readable cookie for client
    const profileInfo = {
      display_name: loginResult.customer?.display_name || null,
      avatar_url: loginResult.customer?.avatar_url || null,
      phone: loginResult.customer?.phone || null,
      phone_verified: loginResult.customer?.phone_verified || false,
      needs_phone: loginResult.needs_phone || false,
    };

    response.cookies.set("customer_profile", JSON.stringify(profileInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
