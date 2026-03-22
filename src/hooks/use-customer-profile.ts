import { useState, useEffect } from "react";
import { logout } from "@/lib/customer-api";

export interface CustomerProfile {
  display_name: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  phone_verified?: boolean;
}

export function useCustomerProfile() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const getProfile = () => {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("customer_profile="));
      if (cookie) {
        try {
          setProfile(JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))));
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfile(null);
    window.location.href = "/dang-nhap";
  };

  return { profile, handleLogout };
}
