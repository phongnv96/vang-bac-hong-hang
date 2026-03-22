"use client";

import { useCallback, useState } from "react";
import {
  createTransaction,
  type TransactionInput,
} from "@/lib/customer-api";

export function useAddTransactionForm(loadData: () => Promise<void>) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const closeAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleAddTransaction = async (data: TransactionInput) => {
    setFormSubmitting(true);
    try {
      await createTransaction(data);
      closeAddForm();
      await loadData();
    } catch (err) {
      console.error("Failed to create transaction:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return {
    showAddForm,
    setShowAddForm,
    closeAddForm,
    formSubmitting,
    handleAddTransaction,
  };
}
