"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TrustPanelSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6 space-y-4">
      <Skeleton className="h-5 w-36" />
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
