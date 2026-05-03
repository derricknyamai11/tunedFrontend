import { useQuery } from "@tanstack/react-query";
import { fetchReferralStats, fetchReferralActivity, fetchRewardHistory } from "../_services/referral.service";
import { FALLBACK_REFERRAL_STATS, FALLBACK_REFERRAL_ACTIVITY, FALLBACK_REWARD_HISTORY } from "../_fallback/referral.fallback";

export function useReferralStats() {
  const query = useQuery({
    queryKey: ["referrals", "stats"],
    queryFn: async () => {
      const res = await fetchReferralStats();
      if (!res.ok) throw new Error(res.error?.message || "Failed to fetch stats");
      return res.data.statistics;
    },
    placeholderData: FALLBACK_REFERRAL_STATS,
  });

  return {
    stats: query.data ?? FALLBACK_REFERRAL_STATS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useReferralActivity(page: number = 1, limit: number = 10) {
  const query = useQuery({
    queryKey: ["referrals", "activity", page, limit],
    queryFn: async () => {
      const res = await fetchReferralActivity(page, limit);
      if (!res.ok) throw new Error(res.error?.message || "Failed to fetch activity");
      return res.data;
    },
    placeholderData: { referrals: FALLBACK_REFERRAL_ACTIVITY, total: 0 },
  });

  return {
    data: query.data ?? { referrals: FALLBACK_REFERRAL_ACTIVITY, total: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useRewardHistory(cursor?: string) {
  const query = useQuery({
    queryKey: ["referrals", "history", cursor],
    queryFn: async () => {
      const res = await fetchRewardHistory(cursor);
      if (!res.ok) throw new Error(res.error?.message || "Failed to fetch history");
      return res.data;
    },
    placeholderData: { history: FALLBACK_REWARD_HISTORY, next_cursor: undefined },
  });

  return {
    data: query.data ?? { history: FALLBACK_REWARD_HISTORY, next_cursor: undefined },
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
