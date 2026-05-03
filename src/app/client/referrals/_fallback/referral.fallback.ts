import type { ReferralStats, ReferralActivity, RewardHistoryEntry } from "../_types/referral.types";

export const FALLBACK_REFERRAL_STATS: ReferralStats = {
  total_referrals: 0,
  total_earned: 0,
  total_used: 0,
  current_balance: 0,
  growth: [],
  referral_code: "------",
  monthly_completed_referrals: 0,
};

export const FALLBACK_REFERRAL_ACTIVITY: ReferralActivity[] = [];

export const FALLBACK_REWARD_HISTORY: RewardHistoryEntry[] = [];
