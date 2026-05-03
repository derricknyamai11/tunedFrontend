"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import type { ChartData } from "../_types/dashboard.types";
import { ChartFrame } from "./ChartFrame";

export function ReferralGrowthChart({ data }: { readonly data: ChartData[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-xl border bg-white shadow-sm h-full flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="tracking-tight text-sm font-semibold">Referral Growth</h3>
        <p className="text-xs text-slate-500">Cumulative commission</p>
      </div>
      <div className="p-6 pt-0 flex-1 min-h-[200px]">
        <ChartFrame>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        </ChartFrame>
      </div>
    </div>
  );
}
