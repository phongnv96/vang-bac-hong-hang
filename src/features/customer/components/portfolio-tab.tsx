"use client";

import { useState } from "react";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  type PortfolioSummary,
  type Transaction,
  type TransactionInput,
} from "@/lib/customer-api";
import { computeBuyTransactionsDisplay } from "@/features/customer/lib/compute-recent-buys";
import { formatVND, fmtPct, pnlColor } from "@/features/customer/lib/format";
import { VndAmount } from "@/features/customer/components/vnd-amount";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart, ShoppingBag, TrendingUp, Wallet } from "lucide-react";

import { EditTransactionForm } from "./edit-transaction-form";
import { SellTransactionForm } from "./sell-transaction-form";
import type { SellTransactionFormValues } from "../lib/transaction-form-schema";

type Props = {
  portfolio: PortfolioSummary | null;
  transactions: Transaction[];
  availableGoldTypes: string[];
  onRefresh: () => Promise<void>;
};

export function PortfolioTab({
  portfolio,
  transactions,
  availableGoldTypes,
  onRefresh,
}: Props) {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [sellFormTx, setSellFormTx] = useState<Transaction | null>(null);
  const [sellSubmitting, setSellSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const buyTransactionsDisplay = computeBuyTransactionsDisplay(
    portfolio,
    transactions,
    10
  );

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
  };

  const closeEditDialog = () => {
    setEditingTx(null);
  };

  const closeSellDialog = () => {
    setSellFormTx(null);
  };

  const handleEditSubmit = async (data: TransactionInput) => {
    if (!editingTx) return;
    setEditSubmitting(true);
    try {
      await updateTransaction(editingTx.id, data);
      closeEditDialog();
      await onRefresh();
    } catch (err) {
      console.error("Failed to update transaction:", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
      await onRefresh();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleMarkSoldClick = (tx: Transaction) => {
    setSellFormTx(tx);
  };

  const handleSellSubmit = async (values: SellTransactionFormValues) => {
    if (!sellFormTx) return;
    setSellSubmitting(true);
    try {
      await createTransaction({
        type: "sell",
        gold_type: sellFormTx.gold_type,
        quantity: values.quantity,
        unit_price: values.unit_price,
        transaction_date: values.transaction_date,
      });
      closeSellDialog();
      await onRefresh();
    } catch (err) {
      console.error("Failed to create sell transaction:", err);
    } finally {
      setSellSubmitting(false);
    }
  };

  const hasPortfolio = portfolio && portfolio.items.length > 0;

  return (
    <div className="relative space-y-8 duration-200">
      <div
        className="pointer-events-none absolute inset-x-0 -top-4 h-32 bg-linear-to-b from-primary/6 to-transparent blur-2xl"
        aria-hidden
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Giao dịch sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSubmitting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleteSubmitting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={editingTx !== null}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-2xl text-primary/90">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
            {editingTx ? (
              <DialogDescription>
                {editingTx.gold_type} · {editingTx.transaction_date}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          {editingTx ? (
            <EditTransactionForm
              key={editingTx.id}
              transaction={editingTx}
              availableGoldTypes={availableGoldTypes}
              submitting={editSubmitting}
              onSubmit={handleEditSubmit}
              onCancel={closeEditDialog}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={sellFormTx !== null}
        onOpenChange={(open) => {
          if (!open) closeSellDialog();
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-2xl text-primary/90">
          <DialogHeader>
            <DialogTitle>Chuyển sang đã bán</DialogTitle>
            {sellFormTx ? (
              <DialogDescription>
                {sellFormTx.gold_type} · Số lượng có thể bán:{" "}
                {sellFormTx.quantity}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          {sellFormTx ? (
            <SellTransactionForm
              key={sellFormTx.id}
              buyTransaction={sellFormTx}
              submitting={sellSubmitting}
              onSubmit={handleSellSubmit}
              onCancel={closeSellDialog}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {hasPortfolio ? (
        <>
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
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
                    Tổng đầu tư
                  </p>
                  <Wallet
                    className="size-4 shrink-0 text-primary/45"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {formatVND(portfolio!.total_invested)}{" "}
                  <span className="text-lg font-semibold text-muted-foreground/80 sm:text-xl">
                    ₫
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60">
              <CardContent className="space-y-2 pt-6 pr-5 pb-6 pl-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Giá trị hiện tại
                  </p>
                  <LineChart
                    className="size-4 shrink-0 text-primary/45"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {portfolio!.total_current_value != null ? (
                    <>
                      {formatVND(portfolio!.total_current_value)}{" "}
                      <span className="text-lg font-semibold text-muted-foreground/80 sm:text-xl">
                        ₫
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-[2px]">
              <div
                className="absolute inset-y-4 right-0 w-px bg-linear-to-b from-transparent via-primary/35 to-transparent"
                aria-hidden
              />
              <CardContent className="space-y-2 pt-6 pr-6 pb-6 pl-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Lời/Lỗ tiềm năng
                  </p>
                  <TrendingUp
                    className="size-4 shrink-0 text-primary/35"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <p
                  className={cn(
                    "text-2xl font-bold tracking-tight tabular-nums sm:text-3xl",
                    portfolio!.total_unrealized_pnl != null
                      ? pnlColor(portfolio!.total_unrealized_pnl)
                      : "text-muted-foreground"
                  )}
                >
                  {portfolio!.total_unrealized_pnl != null ? (
                    <>
                      <VndAmount
                        value={portfolio!.total_unrealized_pnl}
                        suffixClassName="text-current opacity-95"
                      />{" "}
                      ({fmtPct(portfolio!.total_unrealized_pnl_percent)})
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card
            className={cn(
              "group overflow-hidden border-border/45 bg-card/60",
              "border-t-[3px] border-t-primary/50",
              "shadow-[0_20px_48px_-36px_rgba(0,0,0,0.85)]",
              "transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-[0_12px_40px_-24px_rgba(201,168,76,0.12)]"
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Loại vàng
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Giá TB mua
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Giá hiện tại
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Lời/Lỗ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio!.items.map((item, i) => (
                    <tr
                      key={`${item.gold_type}-${i}`}
                      className="border-b border-border/50 hover:bg-secondary/25 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">
                        {item.gold_type}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground tabular-nums">
                        {item.total_quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        <VndAmount
                          value={item.avg_buy_price}
                          className="inline-flex w-full justify-end"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-foreground">
                        {item.current_price != null ? (
                          <VndAmount
                            value={item.current_price}
                            className="inline-flex w-full justify-end"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-medium tabular-nums",
                          pnlColor(item.unrealized_pnl)
                        )}
                      >
                        {item.unrealized_pnl != null ? (
                          <>
                            <VndAmount
                              value={item.unrealized_pnl}
                              className="inline-flex w-full justify-end"
                              suffixClassName="text-current opacity-95"
                            />{" "}
                            ({fmtPct(item.unrealized_pnl_percent)})
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/3 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-muted-foreground sm:text-xl">
            Chưa có tài sản tích lũy
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
            Thêm giao dịch mua để bắt đầu theo dõi.
          </p>
        </div>
      )}

      {buyTransactionsDisplay.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="shrink-0 font-sans text-base font-semibold tracking-tight text-primary/90 sm:text-lg">
              Giao dịch mua gần đây
            </h3>
            <div
              className="h-px min-w-12 flex-1 max-w-[200px] bg-linear-to-r from-primary/60 via-primary/35 to-transparent"
              aria-hidden
            />
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/8 shadow-[inset_0_1px_0_hsl(var(--primary)/0.12)]"
              aria-hidden
            >
              <ShoppingBag
                className="size-4 text-primary/55"
                strokeWidth={1.75}
              />
            </div>
          </div>
          <div className="space-y-4">
            {buyTransactionsDisplay.map((tx) => (
              <div key={tx.id}>
                  <Card
                    className={cn(
                      "overflow-hidden border-border/50 bg-card/70",
                      "border-t-[3px] border-t-primary/55",
                      "shadow-[0_20px_48px_-36px_rgba(0,0,0,0.85)]",
                      "transition-[transform,border-color,box-shadow] duration-200",
                      "motion-safe:hover:-translate-y-px motion-safe:hover:border-t-primary",
                      "motion-safe:hover:shadow-[0_24px_52px_-28px_rgba(201,168,76,0.18)]"
                    )}
                  >
                    <CardContent className="space-y-4 px-4 pt-5 pb-5 sm:px-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-y-2">
                      <div className="flex flex-wrap items-center gap-2.5 gap-y-2">
                        <span className="font-sans text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {tx.gold_type}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "shrink-0 border px-2.5 py-1 text-xs font-medium sm:text-sm",
                            tx.source === "store"
                              ? "border-green-500/35 bg-green-500/12 text-green-400"
                              : "border-primary/35 bg-primary/12 text-primary"
                          )}
                        >
                          {tx.source === "store" ? "Cửa hàng" : "Tự ghi"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-stretch justify-end gap-2">
                        {tx.source === "self" ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              className="cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
                              onClick={() => handleEditClick(tx)}
                            >
                              Sửa
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
                              onClick={() => setDeleteTarget(tx)}
                            >
                              Xoá
                            </Button>
                          </>
                        ) : null}
                        <Button
                          type="button"
                          className="cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
                          onClick={() => handleMarkSoldClick(tx)}
                        >
                          Đã bán
                        </Button>
                      </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch sm:gap-4">
                        <div className="flex flex-col rounded-xl border border-border/45 bg-background/40 px-4 py-3.5">
                          <p className="font-semibold text-xs uppercase tracking-wider text-primary/70">
                            Đơn giá
                          </p>
                          <VndAmount
                            value={tx.unit_price}
                            className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                          />
                        </div>
                        <div className="flex flex-col rounded-xl border border-border/45 bg-background/40 px-4 py-3.5">
                          <p className="font-semibold text-xs uppercase tracking-wider text-primary/70">
                            Ngày mua
                          </p>
                          <p className="mt-2 font-sans text-base font-semibold tabular-nums text-foreground sm:text-lg">
                            {tx.transaction_date}
                          </p>
                        </div>
                        <div className="flex flex-col rounded-xl border border-primary/20 bg-primary/6 px-4 py-3.5">
                          <p className="font-semibold text-xs uppercase tracking-wider text-primary/80">
                            Số lượng
                          </p>
                          <p className="mt-2 font-sans text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
                            {tx.quantity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
