"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase Implicit OAuth appends a hash like #access_token=...&expires_in=...
      const hash = window.location.hash;
      
      if (!hash) {
        // If there's an error query parameter instead
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error_description") || searchParams.get("error");
        if (error) {
          setErrorStatus(error);
          setTimeout(() => router.replace("/dang-nhap?error=auth_failed"), 2000);
          return;
        }

        setErrorStatus("Không tìm thấy thông tin đăng nhập");
        setTimeout(() => router.replace("/dang-nhap?error=missing_code"), 2000);
        return;
      }

      // Parse the hash
      // Remove the leading '#'
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (!accessToken) {
        setErrorStatus("Mã xác thực không hợp lệ");
        setTimeout(() => router.replace("/dang-nhap?error=auth_failed"), 2000);
        return;
      }

      try {
        const res = await fetch("/api/customer-auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });
        
        if (res.ok) {
          router.replace("/tai-khoan");
        } else {
          console.error(await res.text());
          setErrorStatus("Lỗi kết nối máy chủ");
          setTimeout(() => router.replace("/dang-nhap?error=backend_failed"), 2000);
        }
      } catch (err) {
        console.error(err);
        setErrorStatus("Lỗi không xác định");
        setTimeout(() => router.replace("/dang-nhap?error=server_error"), 2000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-theme flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p className="text-primary font-medium text-lg text-center px-4">
        {errorStatus ? `Lỗi: ${errorStatus}` : "Đang xử lý đăng nhập..."}
      </p>
    </div>
  );
}
