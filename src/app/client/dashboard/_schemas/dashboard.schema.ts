import { z } from "zod";

export const OrderStatusZodSchema = z.enum([
  "PENDING", "ACTIVE", "COMPLETED_PENDING_REVIEW", "COMPLETED", "OVERDUE", "CANCELED", "REVISION"
]);

export const PriorityZodSchema = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);

export const ActionableAlertTypeZodSchema = z.enum(["EXTENSION_REQUEST", "PENDING_REVIEW"]);

export const KPIDataSchema = z.object({
  active_projects: z.number(),
  portfolio_value: z.number(),
  reward_points: z.number(),
  next_deadline: z.string().nullable(),
});

export const ChartDataSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const SpendingVelocitySchema = z.object({
  month: z.string(),
  amount: z.number(),
});

export const DashboardAnalyticsSchema = z.object({
  spending_velocity: z.array(SpendingVelocitySchema),
  project_lifecycle: z.array(ChartDataSchema),
  service_mix: z.array(ChartDataSchema),
  referral_growth: z.array(ChartDataSchema),
});

export const MilestoneOrderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  status: OrderStatusZodSchema,
  progress: z.number().min(0).max(100),
  delivered_at: z.string().nullable(),
});

export const UpcomingDeadlineSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  title: z.string(),
  due_date: z.string(),
  priority: PriorityZodSchema,
});

export const ActivityLogEntrySchema = z.object({
  id:          z.string(),
  action:      z.string(),
  entity_type: z.string().nullable(),
  entity_id:   z.string().nullable(),
  created_at:  z.string(),
});

export const DashboardTrackingSchema = z.object({
  latest_order: MilestoneOrderSchema.nullable(),
  upcoming_deadlines: z.array(UpcomingDeadlineSchema),
  activity_feed: z.array(ActivityLogEntrySchema),
});

export const ActionableAlertSchema = z.object({
  id: z.string(),
  type: ActionableAlertTypeZodSchema,
  message: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
  created_at: z.string(),
});

export const DashboardAlertsSchema = z.object({
  alerts: z.array(ActionableAlertSchema),
});
