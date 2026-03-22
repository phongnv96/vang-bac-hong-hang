export interface ProfileInfo {
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  needs_phone: boolean;
}

const COOKIE_NAME = "customer_profile";

export function readProfileCookie(): ProfileInfo | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return null;
  try {
    return JSON.parse(
      decodeURIComponent(cookie.split("=").slice(1).join("="))
    ) as ProfileInfo;
  } catch {
    return null;
  }
}

export function writeProfileCookie(profile: ProfileInfo): void {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=86400; samesite=lax`;
}
