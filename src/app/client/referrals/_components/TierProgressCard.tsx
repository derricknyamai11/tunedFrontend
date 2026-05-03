"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateTierProgress } from "../_utils/referral.utils";
import { Trophy, Target } from "lucide-react";

interface TierProgressCardProps {
  monthlyCompleted: number;
}

export function TierProgressCard({ monthlyCompleted }: TierProgressCardProps) {
  const { currentTier, pointsPerReferral, referralsNeeded, progressPercentage } = 
    calculateTierProgress(monthlyCompleted);

  const isMaxTier = currentTier === 3;

  return (
    <Card className="w-full relative overflow-hidden border-border/50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Tier {currentTier} Status
            </CardTitle>
            <CardDescription>
              Based on {monthlyCompleted} qualified {monthlyCompleted === 1 ? 'referral' : 'referrals'} this month
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {pointsPerReferral} pts / referral
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Progress to Tier {isMaxTier ? currentTier : currentTier + 1}</span>
            <span className="text-foreground">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
          <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            {isMaxTier ? (
              <p className="font-medium">You&apos;ve reached the maximum tier for this month!</p>
            ) : (
              <p className="font-medium text-muted-foreground">
                <strong className="text-foreground">{referralsNeeded} more</strong> qualified {referralsNeeded === 1 ? 'referral' : 'referrals'} needed to unlock <strong className="text-foreground">{(currentTier === 1 ? 12 : 15)} pts per referral</strong>.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
