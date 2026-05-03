"use client";

import { useRewardHistory } from "../_hooks/useReferralQueries";
import { RewardHistorySkeleton } from "./skeletons";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RewardHistory() {
  const { data, isLoading, isError } = useRewardHistory();

  if (isLoading) return <RewardHistorySkeleton />;
  if (isError) return <div className="text-sm text-destructive p-4 border rounded-md">Failed to load history.</div>;

  const { history } = data;

  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No transaction history available.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {history.map((entry) => {
        const isEarned = entry.action === "earned" || entry.points > 0;
        
        return (
          <div key={entry.id} className="group flex items-center justify-between py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 px-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                isEarned ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              }`}>
                {isEarned ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-sm">{entry.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            <div className="text-right pl-4">
              <p className={`font-semibold text-sm ${isEarned ? "text-emerald-600" : "text-foreground"}`}>
                {isEarned ? "+" : ""}{entry.points}
              </p>
            </div>
          </div>
        );
      })}
      
      {data.next_cursor && (
        <div className="pt-4 flex justify-center">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
