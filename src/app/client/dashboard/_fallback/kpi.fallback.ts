import type { KPIData, DashboardAnalytics } from "../_types/dashboard.types";

// Empty fallback — no fake numbers shown while data loads
export const FALLBACK_KPI: KPIData = {
  active_projects: 0,
  portfolio_value: 0,
  reward_points: 0,
  next_deadline: null,
};

export const FALLBACK_ANALYTICS: DashboardAnalytics = {
  spending_velocity: [],
  project_lifecycle: [],
  service_mix: [],
  referral_growth: [],
};
