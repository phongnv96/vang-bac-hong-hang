import { Skeleton } from "@/components/ui/skeleton";

export function AccountLoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme gap-6 px-4">
      <p
        className="animate-pulse text-lg font-serif text-primary sm:text-2xl"
        aria-live="polite"
      >
        Đang tải...
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Skeleton className="h-3 w-full rounded-md bg-primary/15" />
        <Skeleton className="h-3 w-4/5 rounded-md bg-muted/30" />
      </div>
    </div>
  );
}
