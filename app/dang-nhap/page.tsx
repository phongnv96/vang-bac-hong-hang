"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

/**
 * Login page with social sign-in buttons.
 * Redirects to Next.js API routes for server-side OAuth flow.
 * No Supabase credentials exposed to the browser.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-theme">
          <div className="animate-pulse text-primary font-serif text-2xl">Đang tải...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [checking, setChecking] = useState(true);

  // Check if already logged in via cookie
  useEffect(() => {
    const profileCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("customer_profile="));
    if (profileCookie) {
      router.replace("/tai-khoan");
    } else {
      setChecking(false);
    }
  }, [router]);

  const errorMessages: Record<string, string> = {
    missing_code: "Đăng nhập không thành công — thiếu mã xác thực",
    auth_failed: "Xác thực thất bại, vui lòng thử lại",
    backend_failed: "Lỗi hệ thống, vui lòng thử lại sau",
    server_error: "Lỗi máy chủ",
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme">
        <div className="animate-pulse text-primary font-serif text-2xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-primary font-serif text-4xl font-bold tracking-wide">
            Vàng Bạc Hồng Hằng
          </h1>
          <p className="text-muted-foreground text-sm">
            Đăng nhập để theo dõi danh mục tích lũy vàng bạc
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6 shadow-xl shadow-black/30">
          <h2 className="text-card-foreground text-center text-lg font-medium">
            Đăng nhập
          </h2>

          {errorParam && (
            <div className="bg-destructive/20 border border-destructive/50 rounded-md p-3 text-sm text-destructive-foreground">
              {errorMessages[errorParam] || "Đăng nhập thất bại"}
            </div>
          )}

          <div className="space-y-3">
            {/* Google Button — navigates to server-side OAuth */}
            <a
              href="/api/customer-auth/login?provider=google"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium">Đăng nhập bằng Google</span>
            </a>

            {/* Facebook Button */}
            <a
              href="/api/customer-auth/login?provider=facebook"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium">Đăng nhập bằng Facebook</span>
            </a>

            {/* Zalo Button (Coming Soon) */}
            <span
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md border border-border bg-secondary/30 text-muted-foreground opacity-60 cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.18 0-.348.048-.498.144l-5.1 3.46V8.64c0-.264-.216-.48-.48-.48h-.48c-.264 0-.48.216-.48.48v6.72c0 .264.216.48.48.48h.48c.264 0 .48-.216.48-.48v-3.12l5.1 3.456c.15.096.318.144.498.144.384 0 .72-.312.72-.72V8.88c0-.408-.336-.72-.72-.72z" />
              </svg>
              <span className="text-sm font-medium">Zalo (Sắp ra mắt)</span>
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a
            href="/"
            className="text-sm text-primary/80 hover:text-primary transition-colors underline underline-offset-4"
          >
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
