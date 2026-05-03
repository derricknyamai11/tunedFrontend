import { apiGet, apiPost } from "@/api-client";
import type { ApiResult } from "@/lib/types";
import {
  KPIDataSchema, DashboardAnalyticsSchema,
  DashboardTrackingSchema, DashboardAlertsSchema,
} from "../_schemas/dashboard.schema";
import type {
  KPIData, DashboardAnalytics, DashboardTracking, DashboardAlerts,
} from "../_types/dashboard.types";

function logParseError(endpoint: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[DashboardService] ${endpoint} schema violation:`, error);
  }
}

const PARSE_ERROR: ApiResult<never> = {
  ok: false,
  error: { message: "Response validation failed", errors: {}, status: 422 },
};

export async function fetchDashboardKPIs(): Promise<ApiResult<KPIData>> {
  const res = await apiGet<unknown>("/client/dashboard/kpis");
  if (!res.ok) return { ok: false, error: res.error };
  const parsed = KPIDataSchema.safeParse(res.data);
  if (!parsed.success) { logParseError("/dashboard/kpis", parsed.error.format()); return PARSE_ERROR; }
  return { ok: true, data: parsed.data, message: res.message, status: res.status };
}

export async function fetchDashboardAnalytics(): Promise<ApiResult<DashboardAnalytics>> {
  const res = await apiGet<unknown>("/client/dashboard/analytics");
  if (!res.ok) return { ok: false, error: res.error };
  const parsed = DashboardAnalyticsSchema.safeParse(res.data);
  if (!parsed.success) { logParseError("/client/dashboard/analytics", parsed.error.format()); return PARSE_ERROR; }
  return { ok: true, data: parsed.data, message: res.message, status: res.status };
}

export async function fetchDashboardTracking(): Promise<ApiResult<DashboardTracking>> {
  const res = await apiGet<unknown>("/client/dashboard/tracking");
  if (!res.ok) return { ok: false, error: res.error };
  const parsed = DashboardTrackingSchema.safeParse(res.data);
  if (!parsed.success) { logParseError("/client/dashboard/tracking", parsed.error.format()); return PARSE_ERROR; }
  return { ok: true, data: parsed.data, message: res.message, status: res.status };
}

export async function fetchDashboardAlerts(): Promise<ApiResult<DashboardAlerts>> {
  const res = await apiGet<unknown>("/client/dashboard/alerts");
  if (!res.ok) return { ok: false, error: res.error };
  const parsed = DashboardAlertsSchema.safeParse(res.data);
  if (!parsed.success) { logParseError("/client/dashboard/alerts", parsed.error.format()); return PARSE_ERROR; }
  return { ok: true, data: parsed.data, message: res.message, status: res.status };
}

export async function requestReorder(orderId: string): Promise<ApiResult<{ redirect_url: string }>> {
  return apiPost<{ redirect_url: string }>(`/orders/${orderId}/reorder`, {});
}
