"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon, Wallet01Icon, StarIcon, Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { KPICard } from "./KPICard";
import { formatCurrency, formatDeadlineDate } from "../_utils/dashboard.utils";
import type { KPICardsProps } from "../_props/dashboard.props";

const containerClass = [
  "grid grid-cols-1 gap-4 px-4 lg:px-6",
  "*:data-[slot=card]:bg-linear-to-t",
  "*:data-[slot=card]:from-primary/5",
  "*:data-[slot=card]:to-card",
  "*:data-[slot=card]:shadow-xs",
  "@xl/main:grid-cols-2",
  "@4xl/main:grid-cols-4",
].join(" ");

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className={containerClass}>
      <KPICard
        title="Active Projects"
        value={data.active_projects}
        description="Orders currently active or in revision"
        badgeLabel="In Progress"
        badgeClass="text-emerald-600 bg-emerald-50"
        icon={<HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-3 mr-1" />}
      />
      <KPICard
        title="Portfolio Value"
        value={formatCurrency(data.portfolio_value)}
        description="Total value of your active orders"
        badgeLabel="Invested"
        badgeClass="text-blue-600 bg-blue-50"
        icon={<HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-3 mr-1" />}
      />
      <KPICard
        title="Reward Points"
        value={`${data.reward_points} pts`}
        description="Points ready for redemption"
        badgeLabel="Points"
        badgeClass="text-amber-600 bg-amber-50"
        icon={<HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3 mr-1" />}
      />
      <KPICard
        title="Next Deadline"
        value={formatDeadlineDate(data.next_deadline)}
        description="Earliest deadline for active orders"
        badgeLabel="Due Date"
        badgeClass="text-slate-600 bg-slate-50"
        icon={<HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="size-3 mr-1" />}
      />
    </div>
  );
}
