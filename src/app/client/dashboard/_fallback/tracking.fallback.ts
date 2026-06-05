import type { DashboardTracking, DashboardAlerts } from "../_types/dashboard.types";

// Empty fallback — real data loaded from API
export const FALLBACK_TRACKING: DashboardTracking = {
  latest_order: null,
  upcoming_deadlines: [],
  activity_feed: [],
};

export const FALLBACK_ALERTS: DashboardAlerts = {
  alerts: [],
};
