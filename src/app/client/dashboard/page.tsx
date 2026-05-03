"use client";

import { useDashboardQueries } from "./_hooks/useDashboardQueries";
import { KPICards } from "./_components/KPICards";
import { OrderMilestoneTracker } from "./_components/OrderMilestoneTracker";
import { ActionableAlerts } from "./_components/ActionableAlerts";
import { RecentActivityFeed } from "./_components/RecentActivityFeed";
import { UpcomingDeadlines } from "./_components/UpcomingDeadlines";
import { SpendingVelocityChart } from "./_components/SpendingVelocityChart";
import { ProjectLifecycleChart } from "./_components/ProjectLifecycleChart";
import { ServiceMixChart } from "./_components/ServiceMixChart";
import { ReferralGrowthChart } from "./_components/ReferralGrowthChart";
import {
  ChartSkeleton, MilestoneTrackerSkeleton, KPICardsSkeleton,
  FeedSkeleton, AlertsSkeleton,
} from "./_components/skeletons";

export default function DashboardPage() {
  const { kpis, analytics, tracking, alerts, loading } = useDashboardQueries();

  return (
    <div className="@container/main flex min-h-screen flex-col gap-6 overflow-scroll">
      {loading ? <KPICardsSkeleton /> : <KPICards data={kpis} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? <MilestoneTrackerSkeleton /> : <OrderMilestoneTracker order={tracking.latest_order} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[300px]">
            {loading ? <ChartSkeleton /> : <SpendingVelocityChart data={analytics.spending_velocity} />}
            {loading ? <ChartSkeleton /> : <ProjectLifecycleChart data={analytics.project_lifecycle} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[300px]">
            {loading ? <ChartSkeleton /> : <ServiceMixChart data={analytics.service_mix} />}
            {loading ? <ChartSkeleton /> : <ReferralGrowthChart data={analytics.referral_growth} />}
          </div>

          {loading ? <ChartSkeleton /> : <UpcomingDeadlines deadlines={tracking.upcoming_deadlines} />}
        </div>

        <div className="space-y-4">
          {loading ? <AlertsSkeleton /> : <ActionableAlerts alerts={alerts.alerts} />}
          {loading ? <FeedSkeleton /> : <RecentActivityFeed feed={tracking.activity_feed} />}
        </div>
      </div>
    </div>
  );
}
