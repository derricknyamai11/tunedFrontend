"use client";

import {
  Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KPICardProps } from "../_props/dashboard.props";

export function KPICard({
  title,
  value,
  description,
  badgeLabel,
  badgeClass,
  icon,
}: KPICardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className={badgeClass}>
            {icon}
            {badgeLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  );
}
