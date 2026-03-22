"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction, TransactionInput } from "@/lib/customer-api";
import { parseVNDToNumber } from "@/lib/utils";

import { FormDatePicker } from "./form-date-picker";
import {
  editTransactionFormSchema,
  type EditTransactionFormValues,
} from "../lib/transaction-form-schema";

type Props = {
  transaction: Transaction;
  availableGoldTypes: string[];
  submitting: boolean;
  onSubmit: (data: TransactionInput) => void | Promise<void>;
  onCancel: () => void;
};

export function EditTransactionForm({
  transaction,
  availableGoldTypes,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm<EditTransactionFormValues>({
    resolver: zodResolver(
      editTransactionFormSchema
    ) as Resolver<EditTransactionFormValues>,
    defaultValues: {
      gold_type: transaction.gold_type,
      quantity: transaction.quantity,
      unit_price: transaction.unit_price,
      transaction_date: transaction.transaction_date,
      notes: transaction.notes ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      gold_type: transaction.gold_type,
      quantity: transaction.quantity,
      unit_price: transaction.unit_price,
      transaction_date: transaction.transaction_date,
      notes: transaction.notes ?? "",
    });
  }, [transaction.id, transaction, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const notes = values.notes?.trim();
    await onSubmit({
      type: "buy",
      gold_type: values.gold_type,
      quantity: values.quantity,
      unit_price: values.unit_price,
      transaction_date: values.transaction_date,
      notes: notes || undefined,
    });
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&_label]:text-base"
      >
        <FormField
          control={form.control}
          name="gold_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại vàng</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full text-base md:h-9 md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableGoldTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
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
              <FormLabel>Đơn giá (VNĐ)</FormLabel>
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
          label="Ngày giao dịch"
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Tùy chọn"
                  className="h-11 text-base md:h-9 md:text-sm"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
            {submitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
