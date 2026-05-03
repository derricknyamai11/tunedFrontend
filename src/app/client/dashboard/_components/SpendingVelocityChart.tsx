"use client";

import { useMemo } from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import type { SpendingVelocity } from "../_types/dashboard.types";
import { ChartFrame } from "./ChartFrame";

export function SpendingVelocityChart({ data }: { readonly data: SpendingVelocity[] }) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="rounded-xl border bg-white shadow-sm h-full flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="tracking-tight text-sm font-semibold">Spending Velocity</h3>
        <p className="text-xs text-slate-500">Monthly confirmed payments</p>
      </div>
      <div className="p-6 pt-0 flex-1 min-h-[200px]">
        <ChartFrame>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
          </AreaChart>
        </ChartFrame>
      </div>
    </div>
  );
}
