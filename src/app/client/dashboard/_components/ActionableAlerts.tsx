"use client";

import type { ActionableAlertsProps } from "../_props/dashboard.props";
import { AlertCircle } from "lucide-react";

export function ActionableAlerts({ alerts }: ActionableAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border bg-white shadow-sm p-6 text-center text-slate-500 text-sm">
        No pending alerts.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 max-h-[300px] overflow-auto">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            role="alert"
            className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm transition hover:bg-amber-100"
          >
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{alert.message}</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-sm font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
