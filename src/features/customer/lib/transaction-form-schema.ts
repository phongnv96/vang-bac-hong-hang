import { z } from "zod";

import { parseVNDToNumber } from "@/lib/utils";

const isoDate = z
  .string()
  .min(1, "Chọn ngày")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ");

const goldType = z.string().min(1, "Chọn loại vàng");

const quantityPositive = z.coerce
  .number()
  .positive("Số lượng phải lớn hơn 0");

function unitPriceField() {
  return z.preprocess(
    (val) => {
      if (typeof val === "number" && !Number.isNaN(val)) return val;
      if (typeof val === "string") return parseVNDToNumber(val);
      return NaN;
    },
    z.number().gt(0, "Đơn giá phải lớn hơn 0")
  );
}

const notesField = z
  .string()
  .optional()
  .transform((s) => {
    const t = s?.trim();
    return t ? t : undefined;
  });

export const addTransactionFormSchema = z.object({
  type: z.enum(["buy", "sell"] as const, "Chọn loại giao dịch"),
  gold_type: goldType,
  quantity: quantityPositive,
  unit_price: unitPriceField(),
  transaction_date: isoDate,
  notes: notesField,
});

/** Explicit form types (Zod v4 + RHF resolver input inference uses `unknown` for coerce/preprocess). */
export type AddTransactionFormValues = {
  type: "buy" | "sell";
  gold_type: string;
  quantity: number;
  unit_price: number;
  transaction_date: string;
  notes?: string;
};

export type EditTransactionFormValues = {
  gold_type: string;
  quantity: number;
  unit_price: number;
  transaction_date: string;
  notes?: string;
};

export type SellTransactionFormValues = {
  quantity: number;
  unit_price: number;
  transaction_date: string;
};

export function defaultAddTransactionFormValues(): AddTransactionFormValues {
  return {
    type: "buy",
    gold_type: "",
    quantity: 0,
    unit_price: 0,
    transaction_date: new Date().toISOString().split("T")[0],
    notes: "",
  };
}

export const editTransactionFormSchema = z.object({
  gold_type: goldType,
  quantity: quantityPositive,
  unit_price: unitPriceField(),
  transaction_date: isoDate,
  notes: notesField,
});

export const sellTransactionFieldsSchema = z.object({
  quantity: z.coerce.number().positive("Số lượng phải lớn hơn 0"),
  unit_price: unitPriceField(),
  transaction_date: isoDate,
});

export function sellTransactionSchema(maxQuantity: number) {
  return sellTransactionFieldsSchema.refine(
    (d) => d.quantity <= maxQuantity,
    {
      path: ["quantity"],
      message: `Không được vượt quá ${maxQuantity}`,
    }
  );
}
