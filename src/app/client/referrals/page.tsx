"use client";

import { useReferralStats } from "./_hooks/useReferralQueries";
import { useReferralSocket } from "./_services/referral.socket";
import {
  HeroSummaryCard,
  TierProgressCard,
  StatsGrid,
  ReferralActivityList,
  RewardHistory,
  HowItWorks,
  StickyShareCTA,
  HeroSummarySkeleton,
  TierProgressSkeleton,
  StatsGridSkeleton,
} from "./_components";
import { Card, CardContent } from "@/components/ui/card";

export default function ReferralsPage() {
  useReferralSocket();
  const { stats, isLoading } = useReferralStats();

  return (
    <div className="@container/main flex min-h-screen flex-col gap-6 overflow-x-hidden pb-24 md:pb-6 relative">
      <div className="space-y-6 max-w-5xl mx-auto w-full px-4 lg:px-6 mt-4">

        <section id="hero-share-btn">
          {isLoading ? (
            <HeroSummarySkeleton />
          ) : (
            <HeroSummaryCard balance={stats.current_balance} referralCode={stats.referral_code} />
          )}
        </section>

        <section>
          {isLoading ? (
            <TierProgressSkeleton />
          ) : (
            <TierProgressCard monthlyCompleted={stats.monthly_completed_referrals} />
          )}
        </section>

        <section>
          {isLoading ? <StatsGridSkeleton /> : <StatsGrid stats={stats} />}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold px-1">Recent Referrals</h3>
            <ReferralActivityList />
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold px-1">Reward Ledger</h3>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <RewardHistory />
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="pt-4 border-t border-border/50">
          <HowItWorks />
        </section>

      </div>
      
      {!isLoading && <StickyShareCTA referralCode={stats.referral_code} />}
    </div>
  );
}
