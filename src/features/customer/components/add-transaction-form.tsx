"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { TransactionInput } from "@/lib/customer-api";
import { parseVNDToNumber } from "@/lib/utils";

import { FormDatePicker } from "./form-date-picker";
import {
  addTransactionFormSchema,
  defaultAddTransactionFormValues,
  type AddTransactionFormValues,
} from "../lib/transaction-form-schema";

type Props = {
  availableGoldTypes: string[];
  formSubmitting: boolean;
  /** When `embedded`, pass dialog open state so the form resets each time it opens. */
  formOpen?: boolean;
  onSubmit: (data: TransactionInput) => void | Promise<void>;
  onCancel: () => void;
  embedded?: boolean;
};

const fieldGridClass =
  "grid grid-cols-1 sm:grid-cols-2 gap-4 [&_label]:text-base";

function toTransactionInput(values: AddTransactionFormValues): TransactionInput {
  const notes = values.notes?.trim();
  return {
    type: values.type,
    gold_type: values.gold_type,
    quantity: values.quantity,
    unit_price: values.unit_price,
    transaction_date: values.transaction_date,
    notes: notes || undefined,
  };
}

export function AddTransactionForm({
  availableGoldTypes,
  formSubmitting,
  formOpen: formOpenProp,
  onSubmit,
  onCancel,
  embedded = false,
}: Props) {
  const form = useForm<AddTransactionFormValues>({
    resolver: zodResolver(
      addTransactionFormSchema
    ) as Resolver<AddTransactionFormValues>,
    defaultValues: defaultAddTransactionFormValues(),
  });

  const effectiveOpen = embedded ? Boolean(formOpenProp) : true;

  const prevOpen = useRef(false);
  useEffect(() => {
    if (effectiveOpen && !prevOpen.current) {
      form.reset(defaultAddTransactionFormValues());
    }
    prevOpen.current = effectiveOpen;
  }, [effectiveOpen, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(toTransactionInput(values));
  });

  const fields = (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger
                  id="tx-type"
                  className="h-11 w-full text-base md:h-9 md:text-sm"
                >
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="buy">Mua</SelectItem>
                <SelectItem value="sell">Bán</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gold_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại vàng</FormLabel>
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger
                  id="gold-type"
                  className="h-11 w-full text-base md:h-9 md:text-sm"
                >
                  <SelectValue placeholder="-- Chọn loại vàng --" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableGoldTypes.length > 0 ? (
                  availableGoldTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_empty" disabled>
                    Đang tải danh sách...
                  </SelectItem>
                )}
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
                id="quantity"
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
                id="unit-price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="VD: 15600000 hoặc 15.600.000"
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
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <FormControl>
              <Input
                id="notes"
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
    </>
  );

  const actions = (
    <div className="flex justify-end gap-3 border-t border-border/60 pt-4 text-primary/90">
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
        className="min-w-[100px] cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
        disabled={formSubmitting}
      >
        {formSubmitting ? "Đang lưu..." : "Lưu"}
      </Button>
    </div>
  );

  if (embedded) {
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4 text-primary/90">
          <div className={fieldGridClass}>{fields}</div>
          {actions}
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <Card className="animate-row-slide border-primary/20 shadow-lg shadow-black/10 text-primary/90">
        <CardHeader>
          <CardTitle className="font-sans text-xl font-semibold tracking-tight md:text-2xl text-primary/90">
            Thêm giao dịch mới
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="text-primary/90">
          <CardContent className={fieldGridClass}>{fields}</CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-border/60 pt-4">
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
              className="min-w-[100px] cursor-pointer text-base min-h-10 md:min-h-9 md:text-sm"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
