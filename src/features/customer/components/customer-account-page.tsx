"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign, Package } from "lucide-react";
import { logout } from "@/lib/customer-api";
import { useCustomerProfileGate } from "../hooks/use-customer-profile-gate";
import {
  useAccountDashboardData,
  type SoldGroupBy,
} from "../hooks/use-account-dashboard-data";
import { usePhoneOnboarding } from "../hooks/use-phone-onboarding";
import { useAddTransactionForm } from "../hooks/use-add-transaction-form";
import { AccountHeader } from "./account-header";
import { AccountLoadingState } from "./account-loading-state";
import { AddTransactionForm } from "./add-transaction-form";
import { PhoneOnboardingView } from "./phone-onboarding-view";
import { PortfolioTab } from "./portfolio-tab";
import { SoldTab } from "./sold-tab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function CustomerAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"portfolio" | "sold">("portfolio");
  const [soldGroupBy, setSoldGroupBy] = useState<SoldGroupBy>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { profile, setProfile, authenticated } = useCustomerProfileGate();
  const {
    portfolio,
    soldSummary,
    soldItems,
    transactions,
    availableGoldTypes,
    dataLoading,
    loadData,
    setDataLoading,
  } = useAccountDashboardData(soldGroupBy, dateFrom, dateTo);

  const phone = usePhoneOnboarding(profile, setProfile);
  const addTx = useAddTransactionForm(loadData);

  useEffect(() => {
    if (authenticated && profile && !profile.needs_phone) {
      void loadData();
    } else if (authenticated) {
      setDataLoading(false);
    }
  }, [authenticated, profile, loadData, setDataLoading]);

  const handleLogout = async () => {
    await logout();
    router.replace("/dang-nhap");
  };

  if (!authenticated || !profile) {
    return <AccountLoadingState />;
  }

  if (profile.needs_phone) {
    return (
      <PhoneOnboardingView
        phoneInput={phone.phoneInput}
        setPhoneInput={phone.setPhoneInput}
        phoneError={phone.phoneError}
        phoneSubmitting={phone.phoneSubmitting}
        onSubmit={phone.handlePhoneSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-theme">
      <AccountHeader
        profile={profile}
        showAddForm={addTx.showAddForm}
        onToggleAddForm={() => addTx.setShowAddForm((v) => !v)}
        onLogout={handleLogout}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 text-base leading-relaxed text-foreground">
        <Dialog
          open={addTx.showAddForm}
          onOpenChange={(open) => {
            if (!open) addTx.closeAddForm();
          }}
        >
          <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary/90">Thêm giao dịch mới</DialogTitle>
            </DialogHeader>
            <AddTransactionForm
              embedded
              formOpen={addTx.showAddForm}
              availableGoldTypes={availableGoldTypes}
              formSubmitting={addTx.formSubmitting}
              onSubmit={addTx.handleAddTransaction}
              onCancel={addTx.closeAddForm}
            />
          </DialogContent>
        </Dialog>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "portfolio" | "sold")}
          className="gap-5"
        >
          <TabsList className="w-full h-auto p-1 rounded-xl bg-secondary/40 border border-border/60 grid grid-cols-2 sm:max-w-md">
            <TabsTrigger
              value="portfolio"
              className={cn(
                "cursor-pointer gap-2 py-3 rounded-lg text-base font-semibold data-[state=active]:shadow-sm transition-[box-shadow,colors] duration-200 sm:py-2.5"
              )}
            >
              <Package className="size-[1.125rem] shrink-0 sm:size-4" aria-hidden />
              Tích lũy
            </TabsTrigger>
            <TabsTrigger
              value="sold"
              className={cn(
                "cursor-pointer gap-2 py-3 rounded-lg text-base font-semibold data-[state=active]:shadow-sm transition-[box-shadow,colors] duration-200 sm:py-2.5"
              )}
            >
              <CircleDollarSign className="size-[1.125rem] shrink-0 sm:size-4" aria-hidden />
              Đã bán
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-0 outline-none">
            {dataLoading ? (
              <DashboardTabSkeleton />
            ) : (
              <PortfolioTab
                portfolio={portfolio}
                transactions={transactions}
                availableGoldTypes={availableGoldTypes}
                onRefresh={loadData}
              />
            )}
          </TabsContent>

          <TabsContent value="sold" className="mt-0 outline-none">
            {dataLoading ? (
              <DashboardTabSkeleton />
            ) : (
              <SoldTab
                soldSummary={soldSummary}
                soldItems={soldItems}
                groupBy={soldGroupBy}
                onGroupByChange={setSoldGroupBy}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DashboardTabSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl bg-primary/10" />
        <Skeleton className="h-24 rounded-xl bg-primary/10" />
        <Skeleton className="h-24 rounded-xl bg-primary/10" />
      </div>
      <Skeleton className="h-48 rounded-xl bg-muted/30" />
    </div>
  );
}
