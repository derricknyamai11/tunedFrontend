import { useMutation } from "@tanstack/react-query";
import { shareReferral } from "../_services/referral.service";
import type { ShareReferralInput } from "../_schemas/referral.schema";
import { toast } from "sonner";

export function useShareReferral() {
  return useMutation({
    mutationFn: async (data: ShareReferralInput) => {
      const res = await shareReferral(data);
      if (!res.ok) throw new Error(res.error?.message || "Failed to share referral");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Share link generated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate share link");
    },
  });
}
