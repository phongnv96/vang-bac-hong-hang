"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import type {
  SoldItemDetail,
  SoldSummaryResponse,
} from "@/lib/customer-api";
import { ArrowRightLeft, CalendarIcon, Scale } from "lucide-react";
import { pnlColor } from "@/features/customer/lib/format";
import { VndAmount } from "@/features/customer/components/vnd-amount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SoldGroupBy } from "@/features/customer/hooks/use-account-dashboard-data";
import { cn } from "@/lib/utils";

type Props = {
  soldSummary: SoldSummaryResponse | null;
  soldItems: SoldItemDetail[];
  groupBy: SoldGroupBy;
  onGroupByChange: (v: SoldGroupBy) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
};

export function SoldTab({
  soldSummary,
  soldItems,
  groupBy,
  onGroupByChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: Props) {
  const filterBtn = (key: SoldGroupBy, label: string) => (
    <Button
      key={key}
      type="button"
      size="sm"
      variant={groupBy === key ? "default" : "ghost"}
      className={cn(
        "cursor-pointer rounded-full px-4 text-sm transition-[color,box-shadow,transform] duration-200 h-9 min-h-10 sm:min-h-0",
        groupBy === key
          ? "shadow-[0_0_0_1px_hsl(var(--primary)/0.35)] shadow-primary/10"
          : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
      )}
      onClick={() => onGroupByChange(key)}
    >
      {label}
    </Button>
  );

  return (
    <div className="relative space-y-8">
      {/* Subtle vignette — depth without noise */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-4 h-32 bg-linear-to-b from-primary/6 to-transparent blur-2xl"
        aria-hidden
      />

      {soldSummary ? (
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <Card
            className={cn(
              "relative overflow-hidden border-primary/35",
              "bg-linear-to-br from-card via-card to-primary/7",
              "shadow-[0_28px_56px_-32px_rgba(0,0,0,0.75)]"
            )}
          >
            <div
              className="absolute inset-y-3 left-0 w-1 rounded-full bg-linear-to-b from-primary via-primary/80 to-primary/25"
              aria-hidden
            />
            <CardContent className="space-y-2 pt-6 pr-5 pb-6 pl-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary/85">
                  Tổng lời/lỗ đã thực hiện
                </p>
                <Scale
                  className="size-4 shrink-0 text-primary/45"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <VndAmount
                value={soldSummary.overall_realized_pnl}
                className={cn(
                  "text-2xl font-bold tracking-tight sm:text-3xl",
                  pnlColor(soldSummary.overall_realized_pnl)
                )}
                suffixClassName="text-lg font-semibold text-muted-foreground/80 sm:text-xl"
              />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-[2px]">
            <div
              className="absolute inset-y-4 right-0 w-px bg-linear-to-b from-transparent via-primary/35 to-transparent"
              aria-hidden
            />
            <CardContent className="space-y-2 pt-6 pr-6 pb-6 pl-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Tổng giao dịch bán
              </p>
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                {soldSummary.overall_transaction_count}
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  lượt
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="shrink-0 text-sm text-muted-foreground">
            Xem theo
          </span>
          <div
            className={cn(
              "inline-flex gap-1 rounded-full border border-border/60 bg-secondary/30 p-1",
              "shadow-inner shadow-black/20"
            )}
          >
            {filterBtn("monthly", "Tháng")}
            {filterBtn("yearly", "Năm")}
            {filterBtn("custom", "Tùy chọn")}
          </div>
        </div>
        {groupBy === "custom" ? (
          <div className="flex flex-wrap items-center gap-2 animate-row-slide">
            <SoldFilterDatePicker
              value={dateFrom}
              onChange={onDateFromChange}
              placeholder="Từ ngày"
            />
            <span className="text-sm text-muted-foreground">—</span>
            <SoldFilterDatePicker
              value={dateTo}
              onChange={onDateToChange}
              placeholder="Đến ngày"
            />
          </div>
        ) : null}
      </div>

      {soldSummary && soldSummary.periods.length > 0 ? (
        <div className="space-y-3">
          {soldSummary.periods.map((period) => (
            <Card
              key={period.period}
              className="group border-border/45 bg-card/60 transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[0_12px_40px_-24px_rgba(201,168,76,0.15)]"
            >
              <CardContent className="space-y-3 pt-5 pb-5 pl-5 pr-4 sm:pl-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-3">
                  <h4 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {period.period}
                  </h4>
                  <VndAmount
                    value={period.total_realized_pnl}
                    className={cn(
                      "text-xl font-bold sm:text-2xl",
                      pnlColor(period.total_realized_pnl)
                    )}
                    suffixClassName="text-current opacity-95"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div className="rounded-xl border border-border/45 bg-background/35 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
                      Bán
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-foreground sm:text-lg">
                      <VndAmount value={period.total_sold_value} />
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/45 bg-background/35 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
                      Vốn
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-foreground sm:text-lg">
                      <VndAmount value={period.total_buy_cost} />
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/45 bg-background/35 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
                      Số lệnh
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-foreground sm:text-lg">
                      {period.transaction_count}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/3 px-6 py-14 text-center">
          <p className="text-lg text-muted-foreground">
            Chưa có giao dịch bán nào
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
            Dữ liệu sẽ hiển thị khi có giao dịch bán trong kỳ đã chọn.
          </p>
        </div>
      )}

      {soldItems.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="shrink-0 text-base font-semibold tracking-tight text-primary/90 sm:text-lg">
              Giao dịch bán gần đây
            </h3>
            <div
              className="h-px min-w-12 flex-1 max-w-[160px] bg-linear-to-r from-primary/50 to-transparent"
              aria-hidden
            />
            <ArrowRightLeft
              className="size-4 shrink-0 text-primary/35"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
          <div className="space-y-4">
            {soldItems.slice(0, 20).map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "overflow-hidden border-border/50 bg-card/70",
                  "border-t-[3px] border-t-primary/55",
                  "shadow-[0_20px_48px_-36px_rgba(0,0,0,0.85)]",
                  "transition-[transform,border-color] duration-200 motion-safe:hover:-translate-y-px motion-safe:hover:border-t-primary"
                )}
              >
                <CardContent className="space-y-2 pt-2 pb-2 px-4 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-foreground">
                        {item.gold_type}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border px-2 py-0.5 text-xs",
                          item.source === "store"
                            ? "border-green-500/35 bg-green-500/12 text-green-400"
                            : "border-primary/35 bg-primary/12 text-primary"
                        )}
                      >
                        {item.source === "store" ? "Cửa hàng" : "Tự ghi"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground sm:border-l sm:border-border/50 sm:pl-4">
                      SL: {item.quantity}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:items-stretch">
                    <div className="flex flex-col rounded-lg border border-border/40 bg-background/40 px-3 py-2.5">
                     <div className="flex justify-between items-center">
                      <p className="font-semibold text-xs uppercase tracking-wider text-primary/70">
                        Giá mua
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                          {item.buy_date}
                      </p>
                      </div>
                      <p className="mt-1 font-medium text-foreground">
                        <VndAmount value={item.buy_price} />
                      </p>
                    </div>
                    <div className="flex flex-col rounded-lg border border-border/40 bg-background/40 px-3 py-2.5">
                     <div className="flex justify-between items-center">
                      <p className="font-semibold text-xs uppercase tracking-wider text-primary/70">
                        Giá bán
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">{item.sell_date}</p>
                      </div>
                      <p className="mt-1 font-medium text-foreground">
                        <VndAmount value={item.sell_price} />
                      </p>
                    </div>
                    <div className="col-span-2 flex flex-col rounded-lg border border-primary/20 bg-primary/6 px-3 py-2.5 sm:col-span-1">
                      <p className="font-semibold text-xs uppercase tracking-wider text-primary/80">
                        Chênh lệch
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-lg font-semibold",
                          pnlColor(item.realized_pnl)
                        )}
                      >
                        <VndAmount
                          value={item.realized_pnl}
                          className="text-lg font-semibold"
                          suffixClassName="text-current opacity-95"
                        />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SoldFilterDatePicker({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState(false);
  const parsed = value ? parseISO(value) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={placeholder}
          className={cn(
            "h-11 min-h-11 w-auto min-w-42 justify-start rounded-lg border-border/60 bg-input/40 text-left text-base font-normal md:h-9 md:text-sm",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 opacity-70" />
          {selected
            ? format(selected, "d MMM yyyy", { locale: vi })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-100 w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? new Date()}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
