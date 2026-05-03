"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, Coins } from "lucide-react";
import type { ReferralStats } from "../_types/referral.types";

interface StatsGridProps {
  stats: ReferralStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  // TODO: check if backend sends total_referrals = invites.
  // mock "qualified" logic based on completed.
  const qualified = stats.monthly_completed_referrals || 0;
  const pending = stats.total_referrals - qualified;

  const data = [
    {
      label: "Total Invites",
      value: stats.total_referrals,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Qualified",
      value: qualified,
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Pending",
      value: pending >= 0 ? pending : 0,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Points Earned",
      value: stats.total_earned,
      icon: Coins,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <Card key={index} className="overflow-hidden border-border/50 transition-all hover:shadow-md">
          <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">{item.value}</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {item.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
