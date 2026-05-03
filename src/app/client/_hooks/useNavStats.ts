"use client";

import { useState, useEffect } from "react";
import { fetchNavStats } from "../_services/nav.service";
import type { NavStatsState } from "../_types/nav.type";

const FALLBACK_STATE: NavStatsState = {
  activeOrdersCount: 0,
  balance: 0,
  isLoading: true,
};

export function useNavStats(): NavStatsState {
  const [state, setState] = useState<NavStatsState>(FALLBACK_STATE);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetchNavStats();

      if (cancelled) return;

      if (res.ok) {
        setState({
          activeOrdersCount: res.data.active_orders,
          balance: res.data.balance,
          isLoading: false,
        });
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useNavStats] Failed to fetch nav stats:", res.error.message);
        }
        setState({ activeOrdersCount: 0, balance: 0, isLoading: false });
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
