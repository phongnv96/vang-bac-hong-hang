import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/**
 * Public site origin for OAuth redirect (must match browser URL + Supabase allow list).
 *
 * `request.url` alone often stays `http://localhost:3000` in production when:
 * - Host/proxy headers are wrong, or
 * - The login route is hit with an internal URL.
 *
 * Set NEXT_PUBLIC_APP_URL (or APP_URL) in deploy env, e.g. https://yourdomain.com
 * Supabase Dashboard → Authentication → URL Configuration: same URL in Site URL and
 * add https://yourdomain.com/dang-nhap/callback to Redirect URLs.
 */
function getPublicOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (envUrl?.trim()) {
    try {
      return new URL(envUrl.trim()).origin;
    } catch {
      /* fall through */
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0].trim();
    return `${forwardedProto}://${host}`;
  }

  return new URL(request.url).origin;
}

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

  const origin = getPublicOrigin(request);
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
