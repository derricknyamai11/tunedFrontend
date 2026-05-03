"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileIdentitySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-9 w-16 rounded-lg shrink-0" />
      </div>
      <div className="mt-5 pt-5 border-t border-stone-100 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
