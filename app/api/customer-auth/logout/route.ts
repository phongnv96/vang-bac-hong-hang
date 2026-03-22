import { NextResponse } from "next/server";

/**
 * POST /api/customer-auth/logout
 * Clears the auth cookies and redirects to login.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("customer_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("customer_profile", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
