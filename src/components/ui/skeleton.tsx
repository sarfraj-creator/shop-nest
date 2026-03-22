import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <Skeleton className="mb-4 h-52 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <Skeleton className="mb-3 h-3 w-1/3" />
      <Skeleton className="mb-1 h-3 w-full" />
      <Skeleton className="mb-4 h-3 w-4/5" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export { Skeleton };
