"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SecurityLockIcon, Alert01Icon } from "@hugeicons/core-free-icons";
import { formatLastSeen, formatFailedLogins, formatRelativeDate } from "../_utils/profile.utils";
import type { TrustSecurityPanelProps } from "../_props/profile.props";

export function TrustSecurityPanel({ data, onChangePassword }: TrustSecurityPanelProps) {
  const hasSuspiciousActivity = data.failed_login_attempts > 0;



  return (
    <div className={`rounded-2xl shadow-sm border p-6 space-y-4 ${hasSuspiciousActivity ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200/60"}`}>
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={hasSuspiciousActivity ? Alert01Icon : SecurityLockIcon} className={`h-4 w-4 ${hasSuspiciousActivity ? "text-amber-600" : "text-stone-500"}`} strokeWidth={2} />
        <h2 className={`text-sm font-semibold ${hasSuspiciousActivity ? "text-amber-900" : "text-stone-700"}`}>
          Trust &amp; Security
        </h2>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className={hasSuspiciousActivity ? "text-amber-800 font-medium" : "text-stone-600"}>
            {formatFailedLogins(data.failed_login_attempts)}
          </span>
          {hasSuspiciousActivity && data.last_failed_login && (
            <span className="text-xs text-amber-600">{formatRelativeDate(data.last_failed_login)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-stone-500">
          <span>Last sign-in</span>
          <span className="text-stone-700 font-medium">{formatLastSeen(data.last_login_at)}</span>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-stone-600">Password</span>
          <Button variant="outline" size="sm" onClick={onChangePassword} className="text-xs h-8">
            <HugeiconsIcon icon={SecurityLockIcon} className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
