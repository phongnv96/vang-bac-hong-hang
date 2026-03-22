import { Skeleton } from "@/components/ui/skeleton";

export default function TaiKhoanLoading() {
  return (
    <div className="min-h-screen bg-theme">
      <div className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Skeleton className="size-9 rounded-full bg-primary/15" />
          <div className="space-y-2 flex-1 max-w-[200px]">
            <Skeleton className="h-4 w-full bg-primary/15" />
            <Skeleton className="h-3 w-2/3 bg-muted/40" />
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-11 w-full max-w-md rounded-xl bg-secondary/40" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl bg-primary/10" />
          <Skeleton className="h-24 rounded-xl bg-primary/10" />
          <Skeleton className="h-24 rounded-xl bg-primary/10" />
        </div>
        <Skeleton className="h-56 rounded-xl bg-muted/25" />
      </div>
    </div>
  );
}
