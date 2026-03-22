"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  phoneInput: string;
  setPhoneInput: (v: string) => void;
  phoneError: string;
  phoneSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export function PhoneOnboardingView({
  phoneInput,
  setPhoneInput,
  phoneError,
  phoneSubmitting,
  onSubmit,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-primary font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Xin chào!
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            Vui lòng nhập số điện thoại để liên kết với giao dịch tại cửa hàng
          </p>
        </div>
        <Card className="border-border/80 shadow-lg shadow-black/20">
          <CardHeader className="sr-only">
            <CardTitle>Liên kết số điện thoại</CardTitle>
            <CardDescription>Nhập SĐT để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) =>
                    setPhoneInput(e.target.value.replace(/[^0-9+]/g, ""))
                  }
                  placeholder="0912345678"
                  autoComplete="tel"
                  className="h-12 text-base md:h-11 md:text-sm"
                />
                {phoneError ? (
                  <p className="text-base text-destructive md:text-sm" role="alert">
                    {phoneError}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full h-12 cursor-pointer text-base md:h-11 md:text-sm"
                disabled={phoneSubmitting}
              >
                {phoneSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
