"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderFormDialogProps {
  productName: string;
}

export function OrderFormDialog({ productName }: OrderFormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="flex-1 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-semibold h-14 rounded-none hover:brightness-110">
          ĐĂNG KÝ NHẬN TƯ VẤN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">Nhận Báo Giá</DialogTitle>
          <DialogDescription className="font-light text-muted-foreground/80">
            Vui lòng để lại thông tin, chuyên viên tư vấn của Hồng Hằng sẽ liên hệ báo giá và hỗ trợ bạn trong thời gian sớm nhất.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product" className="text-muted-foreground uppercase text-xs tracking-widest">Sản phẩm quan tâm</Label>
            <Input id="product" value={productName} disabled className="bg-secondary/50 font-medium text-foreground rounded-none border-border" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-muted-foreground uppercase text-xs tracking-widest">Họ và tên</Label>
            <Input id="name" placeholder="Ví dụ: Nguyễn Văn A" className="rounded-none border-border focus-visible:ring-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-muted-foreground uppercase text-xs tracking-widest">Số điện thoại</Label>
            <Input id="phone" type="tel" placeholder="09xxxxxxxxx" className="rounded-none border-border focus-visible:ring-primary" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-muted-foreground uppercase text-xs tracking-widest">Ghi chú thêm (Tùy chọn)</Label>
            <Textarea 
              id="notes" 
              placeholder="VD: Cần tư vấn size nhẫn, Giao hàng vào buổi sáng..." 
              className="resize-none rounded-none border-border focus-visible:ring-primary min-h-[80px]" 
            />
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-border mt-2">
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:brightness-110 rounded-none uppercase tracking-widest h-12">
            Gửi Yêu Cầu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
