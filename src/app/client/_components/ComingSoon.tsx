"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ComingSoonProps {
  readonly title: string;
  readonly description: string;
  readonly icon: IconSvgElement;
  readonly eta?: string;
}

export function ComingSoon({ title, description, icon, eta }: ComingSoonProps) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md text-center shadow-lg border border-slate-200 bg-white">
        <CardHeader className="pb-2 pt-10 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
            <HugeiconsIcon icon={icon} strokeWidth={1.5} className="size-8 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-slate-900">{title}</CardTitle>
            <CardDescription className="text-sm text-slate-500 leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10 flex flex-col items-center gap-4">
          <Badge
            variant="outline"
            className="text-emerald-700 border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium"
          >
            Coming Soon
          </Badge>
          {eta && (
            <p className="text-xs text-slate-400">
              Expected availability: <span className="font-medium text-slate-500">{eta}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
