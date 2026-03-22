"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DesktopAuth() {
  const { profile, handleLogout } = useCustomerProfile();

  if (!profile) {
    return (
      <Link href="/dang-nhap">
        <Button variant="outline" className="text-primary font-semibold border-primary hover:bg-primary/10">
          <User className="w-4 h-4 mr-2" />
          Đăng nhập
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-primary/50"
        >
          <User className="w-4 h-4 text-primary" />
          <span className="max-w-[120px] truncate">{profile.display_name || "Khách hàng"}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-secondary">
          <Link href="/tai-khoan" className="flex items-center w-full">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Bảng điều khiển
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10">
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileAuth() {
  const { profile, handleLogout } = useCustomerProfile();

  if (!profile) {
    return (
      <Link href="/dang-nhap">
        <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
          <User className="w-4 h-4 mr-2" />
          Đăng nhập / Đăng ký
        </Button>
      </Link>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{profile.display_name || "Khách hàng"}</p>
          <p className="text-xs text-muted-foreground">Thành viên</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link href="/tai-khoan">
          <Button variant="outline" className="w-full text-xs">
            <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
            Quản lý
          </Button>
        </Link>
        <Button variant="outline" className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20" onClick={handleLogout}>
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
