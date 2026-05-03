import type { KPIData, DashboardAnalytics, DashboardTracking, DashboardAlerts } from "../_types/dashboard.types";

export interface KPICardsProps {
  readonly data: KPIData;
}

export interface KPICardProps {
  readonly title: string;
  readonly value: string | number;
  readonly description: string;
  readonly badgeLabel: string;
  readonly badgeClass: string;
  readonly icon: React.ReactNode;
}

export interface SpendingVelocityChartProps {
  readonly data: DashboardAnalytics["spending_velocity"];
}

export interface ProjectLifecycleChartProps {
  readonly data: DashboardAnalytics["project_lifecycle"];
}

export interface ServiceMixChartProps {
  readonly data: DashboardAnalytics["service_mix"];
}

export interface ReferralGrowthChartProps {
  readonly data: DashboardAnalytics["referral_growth"];
}

export interface OrderMilestoneTrackerProps {
  readonly order: DashboardTracking["latest_order"];
}

export interface UpcomingDeadlinesProps {
  readonly deadlines: DashboardTracking["upcoming_deadlines"];
}

export interface RecentActivityFeedProps {
  readonly feed: DashboardTracking["activity_feed"];
}

export interface ActionableAlertsProps {
  readonly alerts: DashboardAlerts["alerts"];
}
