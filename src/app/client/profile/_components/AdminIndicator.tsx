"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldKeyIcon } from "@hugeicons/core-free-icons";
import type { AdminIndicatorProps } from "../_props/profile.props";

export function AdminIndicator({ isAdmin }: AdminIndicatorProps) {
  if (!isAdmin) return null;

  return (
    <Link
      href={"/admin" as never}
      className="inline-flex items-center gap-1.5 group"
      aria-label="Go to Admin Panel"
    >
      <Badge
        variant="secondary"
        className="gap-1.5 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200 transition-colors cursor-pointer px-3 py-1"
      >
        <HugeiconsIcon icon={ShieldKeyIcon} className="h-3.5 w-3.5" strokeWidth={2} />
        Admin Panel
      </Badge>
    </Link>
  );
}
