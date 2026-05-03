"use client";

import { PieChart, Pie, Tooltip, Legend } from "recharts";
import type { ChartData } from "../_types/dashboard.types";
import { ChartFrame } from "./ChartFrame";

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

export function ProjectLifecycleChart({ data }: { readonly data: ChartData[] }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((entry, index) => ({
    ...entry,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="rounded-xl border bg-white shadow-sm h-full flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="tracking-tight text-sm font-semibold">Project Lifecycle</h3>
      </div>
      <div className="p-6 pt-0 flex-1 min-h-[250px]">
        <ChartFrame>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            />

            <Tooltip wrapperStyle={{ borderRadius: '8px', outline: 'none' }} />
            <Legend verticalAlign="bottom" height={25} iconType="circle" fontSize={8} />
          </PieChart>
          </ChartFrame>
      </div>
    </div>
  );
}
