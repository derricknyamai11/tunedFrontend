"use client";

import { RelativeTime } from "./relativeTime";
import type { RecentActivityFeedProps } from "../_props/dashboard.props";
const ACTION_LABELS: Record<string, string> = {
  order_created:        "New order submitted",
  order_updated:        "Order updated",
  order_completed:      "Order marked as completed",
  order_reordered:      "Order resubmitted",
  payment_confirmed:    "Payment confirmed",
  payment_failed:       "Payment failed",
  user_login:           "You signed in",
  user_register:        "Account created",
  email_verification:   "Email verified",
  extension_requested:  "Deadline extension requested",
  revision_requested:   "Revision requested",
};

function humanize(action: string): string {
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ");
}

export function RecentActivityFeed({ feed }: RecentActivityFeedProps) {
  if (feed.length === 0) {
    return (
      <div className="rounded-xl border bg-white shadow-sm p-6 text-center text-slate-500 text-sm h-full flex items-center justify-center">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 max-h-[400px] overflow-y-auto">
      <div className="rounded-xl border bg-white shadow-sm h-full flex flex-col">
        <div className="p-6 pb-2 border-b">
          <h3 className="tracking-tight text-sm font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6 flex-1 overflow-y-auto max-h-[400px]">
          <ul className="space-y-6">
            {feed.map((entry) => (
              <li key={entry.id} className="relative flex gap-4">
                <div className="absolute left-[11px] top-6 -bottom-6 w-px bg-slate-200 last:hidden" aria-hidden="true" />
                <div className="relative mt-1.5 h-6 w-6 shrink-0 rounded-full border-2 border-emerald-600 bg-white shadow-sm" />
                <div className="flex-1 pb-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 wrap-break-word">
                    {humanize(entry.action)}
                    {entry.entity_id && (
                      <span className="ml-1 text-slate-400 text-xs font-normal">
                        #{entry.entity_id.slice(0, 8)}
                      </span>
                    )}
                  </p>
                  <RelativeTime date={entry.created_at} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
