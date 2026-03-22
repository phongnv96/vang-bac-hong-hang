"use client";

import { useCallback, useState } from "react";
import {
  getPortfolio,
  getSoldSummary,
  getSoldItems,
  listTransactions,
  getLatestPrices,
  type PortfolioSummary,
  type SoldSummaryResponse,
  type SoldItemDetail,
  type Transaction,
} from "@/lib/customer-api";

export type SoldGroupBy = "monthly" | "yearly" | "custom";

export function useAccountDashboardData(
  soldGroupBy: SoldGroupBy,
  dateFrom: string,
  dateTo: string
) {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [soldSummary, setSoldSummary] = useState<SoldSummaryResponse | null>(
    null
  );
  const [soldItems, setSoldItems] = useState<SoldItemDetail[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableGoldTypes, setAvailableGoldTypes] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const soldParams =
        soldGroupBy === "custom" && (dateFrom || dateTo)
          ? {
              date_from: dateFrom || undefined,
              date_to: dateTo || undefined,
            }
          : {};
      const [p, s, soldItemsRes, t, pricesRes] = await Promise.all([
        getPortfolio(),
        getSoldSummary({
          group_by: soldGroupBy === "custom" ? "monthly" : soldGroupBy,
          ...soldParams,
        }),
        getSoldItems(soldParams),
        listTransactions({ limit: "50" }),
        getLatestPrices(),
      ]);
      setPortfolio(p);
      setSoldSummary(s);
      setSoldItems(soldItemsRes ?? []);
      setTransactions(t?.items ?? []);
      if (pricesRes?.prices) {
        setAvailableGoldTypes(
          pricesRes.prices
            .map(
              (pr) =>
                pr.name ||
                pr.type ||
                (pr as { row_name?: string }).row_name
            )
            .filter(Boolean) as string[]
        );
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [soldGroupBy, dateFrom, dateTo]);

  return {
    portfolio,
    soldSummary,
    soldItems,
    transactions,
    availableGoldTypes,
    dataLoading,
    loadData,
    setDataLoading,
  };
}
