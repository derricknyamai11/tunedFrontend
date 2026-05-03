import type { KPIData, DashboardAnalytics } from "../_types/dashboard.types";


export const FALLBACK_KPI: KPIData = {
  active_projects: 3,
  portfolio_value: 450.50,
  reward_points: 1250,
  next_deadline: "2026-05-15T10:00:00.000Z",
};


export const FALLBACK_ANALYTICS: DashboardAnalytics = {
  spending_velocity: [
    { month: "Jan", amount: 150 }, { month: "Feb", amount: 320 },
    { month: "Mar", amount: 200 }, { month: "Apr", amount: 450 },
    { month: "May", amount: 380 }, { month: "Jun", amount: 590 },
  ],
  project_lifecycle: [
    { name: "Pending", value: 2 }, { name: "Active", value: 3 },
    { name: "Revision", value: 1 }, { name: "Completed", value: 12 },
  ],
  service_mix: [
    { name: "Case Study", value: 4 }, { name: "Research Paper", value: 6 },
    { name: "Presentation", value: 2 }, { name: "Editing", value: 8 },
  ],
  referral_growth: [
    { name: "Jan", value: 0 }, { name: "Feb", value: 15 },
    { name: "Mar", value: 45 }, { name: "Apr", value: 75 },
    { name: "May", value: 120 }, { name: "Jun", value: 210 },
  ],
};
