/**
 * Customer API client — calls Next.js API proxy (no direct backend exposure).
 * All requests go through /api/customer-auth/proxy which reads
 * the httpOnly cookie and forwards to the FastAPI backend.
 */

async function proxyFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string>;
  } = {}
): Promise<T> {
  const qs = new URLSearchParams({ path });
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
  }

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin", // send cookies
  };

  if (options.body && (options.method === "POST" || options.method === "PUT")) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(`/api/customer-auth/proxy?${qs.toString()}`, fetchOptions);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody?.error?.message || errorBody?.error || res.statusText;
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const json = await res.json();
  // unwrap success envelope
  return json.data ?? json;
}

// --- Profile ---

export async function getCustomerProfile() {
  return proxyFetch<CustomerProfile>("/customer-auth/me");
}

export async function updateCustomerPhone(phone: string) {
  return proxyFetch<CustomerProfile>("/customer-auth/phone", {
    method: "PUT",
    body: { phone },
  });
}

// --- Prices ---

export async function getLatestPrices() {
  const res = await fetch("/api/prices");
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json() as Promise<{
    prices: Array<{ name?: string; type?: string; buy?: string; sell?: string }>;
    date: string;
    exists: boolean;
  }>;
}

// --- Transactions ---

export async function getPortfolio() {
  return proxyFetch<PortfolioSummary>("/customer-transactions/portfolio");
}

export async function getSoldSummary(
  params: { group_by?: string; date_from?: string; date_to?: string } = {}
) {
  return proxyFetch<SoldSummaryResponse>("/customer-transactions/sold-summary", {
    params: params as Record<string, string>,
  });
}

export async function getSoldItems(
  params: { date_from?: string; date_to?: string } = {}
) {
  return proxyFetch<SoldItemDetail[]>(
    "/customer-transactions/sold-items",
    { params: params as Record<string, string> }
  );
}

export async function listTransactions(
  params: { type?: string; date_from?: string; date_to?: string; skip?: string; limit?: string } = {}
) {
  return proxyFetch<{ items: Transaction[]; meta: { skip: number; limit: number; total: number } }>(
    "/customer-transactions/",
    { params: params as Record<string, string> }
  );
}

export async function createTransaction(data: TransactionInput) {
  return proxyFetch<Transaction>("/customer-transactions/", {
    method: "POST",
    body: data,
  });
}

export async function updateTransaction(txId: string, data: Partial<TransactionInput>) {
  return proxyFetch<Transaction>(`/customer-transactions/${txId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteTransaction(txId: string) {
  return proxyFetch<void>(`/customer-transactions/${txId}`, {
    method: "DELETE",
  });
}

// --- Logout ---

export async function logout() {
  await fetch("/api/customer-auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}

// --- Types ---

export interface CustomerProfile {
  id: string;
  phone: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone_verified: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface PortfolioItem {
  gold_type: string;
  total_quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_price: number | null;
  current_value: number | null;
  unrealized_pnl: number | null;
  unrealized_pnl_percent: number | null;
}

export interface PortfolioSummary {
  items: PortfolioItem[];
  total_invested: number;
  total_current_value: number | null;
  total_unrealized_pnl: number | null;
  total_unrealized_pnl_percent: number | null;
}

export interface Transaction {
  id: string;
  customer_id: string;
  type: "buy" | "sell";
  gold_type: string;
  quantity: number;
  unit_price: number;
  transaction_date: string;
  source: "store" | "self";
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransactionInput {
  type: "buy" | "sell";
  gold_type: string;
  quantity: number;
  unit_price: number;
  transaction_date: string;
  notes?: string;
}

export interface PeriodSummary {
  period: string;
  total_sold_value: number;
  total_buy_cost: number;
  total_realized_pnl: number;
  transaction_count: number;
}

export interface SoldSummaryResponse {
  periods: PeriodSummary[];
  overall_realized_pnl: number;
  overall_transaction_count: number;
}

export interface SoldItemDetail {
  id: string;
  gold_type: string;
  quantity: number;
  buy_price: number;
  sell_price: number;
  buy_date: string;
  sell_date: string;
  realized_pnl: number;
  source: "store" | "self";
}
