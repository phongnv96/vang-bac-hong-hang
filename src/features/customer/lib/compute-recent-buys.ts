import type { PortfolioSummary, Transaction } from "@/lib/customer-api";

/**
 * Buy rows to show: match held quantity per gold type (FIFO-style display cap).
 */
export function computeBuyTransactionsDisplay(
  portfolio: PortfolioSummary | null,
  transactions: Transaction[],
  displayLimit = 10
): Transaction[] {
  const heldByGoldType = new Map(
    (portfolio?.items ?? []).map((i) => [i.gold_type, i.total_quantity])
  );
  const buysByType = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.type !== "buy" || !heldByGoldType.has(t.gold_type)) continue;
    const list = buysByType.get(t.gold_type) ?? [];
    list.push(t);
    buysByType.set(t.gold_type, list);
  }
  const buyTransactions: Transaction[] = [];
  for (const [goldType, list] of buysByType) {
    const held = Number(heldByGoldType.get(goldType) ?? 0);
    const limit = Math.max(1, Math.ceil(held));
    const sorted = [...list].sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    );
    buyTransactions.push(...sorted.slice(0, limit));
  }
  buyTransactions.sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime()
  );
  return buyTransactions.slice(0, displayLimit);
}
