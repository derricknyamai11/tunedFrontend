"use client";

import { useState } from "react";
import { useReferralActivity } from "../_hooks/useReferralQueries";
import { ReferralActivitySkeleton } from "./skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { ReferralStatus } from "../_types/referral.types";

export function ReferralActivityList() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError } = useReferralActivity(page, limit);

  if (isLoading) return <ReferralActivitySkeleton />;
  if (isError) return <div className="text-sm text-destructive p-4 border rounded-md">Failed to load activity.</div>;

  const { referrals, total } = data;

  if (!referrals || referrals.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30">
        <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
          <p className="font-medium">No referrals yet</p>
          <p className="text-sm mt-1">Share your link to get started!</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">Qualified</Badge>;
      case "PENDING":
      case "ACTIVE":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {referrals.map((referral) => (
          <Card key={referral.id} className="overflow-hidden hover:bg-muted/5 transition-colors">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-primary text-sm uppercase">
                    {referral.referred_name?.[0] || referral.code[0]}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground leading-none">
                    {referral.referred_name || `User (${referral.code})`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(referral.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                <div className="text-left sm:text-right">
                  {referral.points_earned > 0 ? (
                    <p className="font-semibold text-emerald-600">+{referral.points_earned} pts</p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">-</p>
                  )}
                </div>
                <div>
                  {getStatusBadge(referral.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
