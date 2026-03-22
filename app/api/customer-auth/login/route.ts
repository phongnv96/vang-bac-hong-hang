import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/**
 * GET /api/customer-auth/login?provider=google|facebook
 * Generates a Supabase OAuth URL and redirects the user.
 * All credentials stay server-side.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") as "google" | "facebook" | null;

  if (!provider || !["google", "facebook"].includes(provider)) {
    return NextResponse.json(
      { error: "Invalid provider. Use ?provider=google or ?provider=facebook" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get the origin from the request to build callback URL
  const origin = new URL(request.url).origin;
  // Send the callback to a client-side page that can read the URL hash fragment (#access_token)
  const redirectTo = `${origin}/dang-nhap/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true, // get URL only, don't auto-redirect immediately
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate OAuth URL" },
      { status: 500 }
    );
  }

  // Redirect user to OAuth provider
  return NextResponse.redirect(data.url);
}
