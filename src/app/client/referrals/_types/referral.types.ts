export interface ReferralStats {
  total_referrals: number;
  total_earned: number;
  total_used: number;
  current_balance: number;
  growth: [string, number][];
  referral_code: string;
  monthly_completed_referrals: number;
}

export type ReferralStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED";

export interface ReferralActivity {
  id: string;
  referred_id: string;
  referred_name: string;
  code: string;
  status: ReferralStatus;
  points_earned: number;
  created_at: string;
  completed_at?: string;
}

export interface RewardHistoryEntry {
  id: string;
  action: string;
  points: number;
  date: string;
  description: string;
}

export interface ShareResponse {
  share_link: string;
  message: string;
  platform: string;
}
