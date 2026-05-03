import { apiGet, apiPost } from "@/api-client";
import type { ReferralStats, ReferralActivity, RewardHistoryEntry, ShareResponse } from "../_types/referral.types";
import type { ShareReferralInput } from "../_schemas/referral.schema";

export async function fetchReferralStats() {
  return apiGet<{ statistics: ReferralStats }>("/client/referrals/stats");
}

export async function fetchReferralActivity(page: number, limit: number) {
  return apiGet<{ referrals: ReferralActivity[], total: number }>(`/client/referrals?page=${page}&limit=${limit}`);
}

export async function fetchRewardHistory(cursor?: string) {
  const params = cursor ? `?cursor=${cursor}` : "";
  return apiGet<{ history: RewardHistoryEntry[], next_cursor?: string }>(`/client/referrals/history${params}`);
}

export async function shareReferral(data: ShareReferralInput) {
  return apiPost<ShareResponse>("/client/referrals/share", data);
}
