"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  readProfileCookie,
  type ProfileInfo,
} from "@/features/customer/lib/profile-cookie";

export function useCustomerProfileGate() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const p = readProfileCookie();
    if (!p) {
      router.replace("/dang-nhap");
      return;
    }
    startTransition(() => {
      setProfile(p);
      setAuthenticated(true);
    });
  }, [router, startTransition]);

  return { profile, setProfile, authenticated };
}
