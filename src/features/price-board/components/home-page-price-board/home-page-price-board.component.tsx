"use client";

import { usePrices } from "../../hooks/use-prices";
import { useClock } from "../../hooks/use-clock";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";

export function HomePagePriceBoard() {
  const prices = usePrices();
  const dateTime = useClock();

  return (
    <div className="bg-secondary/40 border border-primary/20 backdrop-blur-md p-6 md:p-10 max-w-4xl mx-auto relative overflow-hidden rounded-xl">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-primary/20 pb-6 gap-4">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Bảng Giá Vàng</h2>
            <p className="text-muted-foreground font-light text-sm">
              Cập nhật lúc: <span className="text-foreground tracking-wider font-mono bg-background/50 px-2 py-1 rounded inline-block ml-1">{dateTime || "--/--/---- | --:--:--"}</span>
            </p>
          </div>
          <Link href="/bang-gia-vang" className="hidden md:inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors uppercase tracking-widest text-xs border border-primary/30 px-4 py-2 hover:bg-primary/5 rounded-full">
            Xem Toàn Màn Hình <ArrowUpRight className="ml-2 w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-primary/30">
                <th className="py-3 px-4 text-primary font-semibold text-sm uppercase tracking-widest bg-primary/5">Loại Vàng</th>
                <th className="py-3 px-4 text-primary font-semibold text-sm uppercase tracking-widest bg-primary/5 text-right w-[30%]">Mua Vào</th>
                <th className="py-3 px-4 text-primary font-semibold text-sm uppercase tracking-widest bg-primary/5 text-right w-[30%]">Bán Ra</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-primary/10 hover:bg-primary/5 transition-colors group"
                >
                  <td className="py-4 px-4 font-serif text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                    {row.name}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-lg md:text-xl tracking-wider text-[#fff176]">
                      {row.buy ? formatVND(row.buy) : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-lg md:text-xl tracking-wider text-[#66ff99]">
                      {row.sell ? formatVND(row.sell) : "-"}
                    </span>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-muted-foreground font-light">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center md:hidden">
            <Link href="/bang-gia-vang" className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors uppercase tracking-widest text-xs">
              Xem chi tiết <ArrowUpRight className="ml-1 w-3 h-3" />
            </Link>
        </div>
      </div>
    </div>
  );
}
