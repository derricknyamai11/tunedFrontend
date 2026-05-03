"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
      ))}
    </div>
  );
}

export function MilestoneTrackerSkeleton() {
  return <Skeleton className="h-40 w-full rounded-xl" />;
}

export function ChartSkeleton() {
  return <Skeleton className="h-[280px] w-full rounded-xl" />;
}

export function FeedSkeleton() {
  return <Skeleton className="h-[400px] w-full rounded-xl" />;
}

export function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}
