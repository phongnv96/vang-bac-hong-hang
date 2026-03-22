"use client";

/* eslint-disable @next/next/no-img-element -- OAuth profile URLs use arbitrary hosts */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProfileInfo } from "@/features/customer/lib/profile-cookie";

type Props = {
  profile: ProfileInfo;
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onLogout: () => void;
};

export function AccountHeader({
  profile,
  showAddForm,
  onToggleAddForm,
  onLogout,
}: Props) {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              width={36}
              height={36}
              className="rounded-full border border-primary/40 shrink-0 object-cover size-9"
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground font-serif truncate">
              {profile.display_name || "Khách hàng"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {profile.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            size="default"
            onClick={onToggleAddForm}
            className="cursor-pointer gap-1.5 text-sm sm:h-9 sm:text-sm min-h-10 px-4"
            variant={showAddForm ? "secondary" : "default"}
          >
            <Plus className="size-[1.125rem] sm:size-4" aria-hidden />
            Thêm giao dịch
          </Button>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="text-muted-foreground cursor-pointer text-sm min-h-10 sm:h-9 sm:min-h-0"
            onClick={onLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
