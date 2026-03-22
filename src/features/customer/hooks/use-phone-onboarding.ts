"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { updateCustomerPhone } from "@/lib/customer-api";
import {
  writeProfileCookie,
  type ProfileInfo,
} from "@/features/customer/lib/profile-cookie";

export function usePhoneOnboarding(
  profile: ProfileInfo | null,
  setProfile: Dispatch<SetStateAction<ProfileInfo | null>>
) {
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 9) {
      setPhoneError("Số điện thoại không hợp lệ");
      return;
    }
    setPhoneSubmitting(true);
    setPhoneError("");
    try {
      await updateCustomerPhone(phoneInput);
      if (profile) {
        const updated: ProfileInfo = {
          ...profile,
          phone: phoneInput,
          phone_verified: true,
          needs_phone: false,
        };
        writeProfileCookie(updated);
        setProfile(updated);
      }
    } catch (err) {
      setPhoneError(
        err instanceof Error ? err.message : "Lỗi cập nhật SĐT"
      );
    } finally {
      setPhoneSubmitting(false);
    }
  };

  return {
    phoneInput,
    setPhoneInput,
    phoneError,
    phoneSubmitting,
    handlePhoneSubmit,
  };
}
