"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Transaction } from "@/lib/customer-api";
import { parseVNDToNumber } from "@/lib/utils";

import { FormDatePicker } from "./form-date-picker";
import {
  sellTransactionSchema,
  type SellTransactionFormValues,
} from "../lib/transaction-form-schema";

type Props = {
  buyTransaction: Transaction;
  submitting: boolean;
  onSubmit: (data: SellTransactionFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function SellTransactionForm({
  buyTransaction,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const resolver = useMemo(
    () =>
      zodResolver(sellTransactionSchema(buyTransaction.quantity)) as Resolver<SellTransactionFormValues>,
    [buyTransaction.quantity]
  );

  const form = useForm<SellTransactionFormValues>({
    resolver,
    defaultValues: {
      quantity: buyTransaction.quantity,
      unit_price: 0,
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    form.reset({
      quantity: buyTransaction.quantity,
      unit_price: 0,
      transaction_date: new Date().toISOString().split("T")[0],
    });
  }, [buyTransaction.id, buyTransaction.quantity, form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&_label]:text-base text-primary/90"
      >
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng bán</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={buyTransaction.quantity}
                  className="h-11 text-base md:h-9 md:text-sm"
                  value={field.value > 0 ? String(field.value) : ""}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá bán (VNĐ)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="VD: 14000000 hoặc 14.000.000"
                  className="h-11 text-base tabular-nums md:h-9 md:text-sm"
                  value={field.value > 0 ? String(field.value) : ""}
                  onChange={(e) =>
                    field.onChange(parseVNDToNumber(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDatePicker
          control={form.control}
          name="transaction_date"
          label="Ngày bán"
        />
        <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : "Xác nhận bán"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
