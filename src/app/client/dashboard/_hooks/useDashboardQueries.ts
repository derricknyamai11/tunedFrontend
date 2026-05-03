"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { webSocketService } from "@/lib/services/websocket.service";
import {
  fetchDashboardKPIs, fetchDashboardAnalytics,
  fetchDashboardTracking, fetchDashboardAlerts,
} from "../_services/dashboard.service";
import type {
  DashboardTracking, DashboardAlerts,
  MilestoneOrder, ActionableAlert,
} from "../_types/dashboard.types";
import {
  FALLBACK_KPI, FALLBACK_ANALYTICS, FALLBACK_TRACKING, FALLBACK_ALERTS,
} from "../_fallback/dashboard.fallback";

export function useDashboardQueries() {
  const queryClient = useQueryClient();

  // Queries
  const kpiQuery = useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      const res = await fetchDashboardKPIs();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: FALLBACK_KPI,
  });

  const analyticsQuery = useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: async () => {
      const res = await fetchDashboardAnalytics();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: FALLBACK_ANALYTICS,
  });

  const trackingQuery = useQuery({
    queryKey: ["dashboard", "tracking"],
    queryFn: async () => {
      const res = await fetchDashboardTracking();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: FALLBACK_TRACKING,
  });

  const alertsQuery = useQuery({
    queryKey: ["dashboard", "alerts"],
    queryFn: async () => {
      const res = await fetchDashboardAlerts();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: FALLBACK_ALERTS,
  });

  // WebSocket Sync
  useEffect(() => {
    const socket = webSocketService.connect();

    socket.on("order.updated", (data: MilestoneOrder) => {
      queryClient.setQueryData(["dashboard", "tracking"], (old: DashboardTracking | undefined) => {
        if (!old || !old.latest_order || old.latest_order.id !== data.id) return old;
        return { ...old, latest_order: data };
      });
    });

    socket.on("actionable_alert.new", (data: ActionableAlert) => {
      queryClient.setQueryData(["dashboard", "alerts"], (old: DashboardAlerts | undefined) => {
        if (!old) return { alerts: [data] };
        return { ...old, alerts: [data, ...old.alerts] };
      });
    });

    return () => {
      socket.off("order.updated");
      socket.off("actionable_alert.new");
    };
  }, [queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }, [queryClient]);

  return {
    kpis: kpiQuery.data ?? FALLBACK_KPI,
    analytics: analyticsQuery.data ?? FALLBACK_ANALYTICS,
    tracking: trackingQuery.data ?? FALLBACK_TRACKING,
    alerts: alertsQuery.data ?? FALLBACK_ALERTS,
    loading: kpiQuery.isLoading || analyticsQuery.isLoading || trackingQuery.isLoading || alertsQuery.isLoading,
    refresh,
  };
}
