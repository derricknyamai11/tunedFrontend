"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "../_services/profile.service";

export function useChangePasswordMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const res = await changePassword(data);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to change password");
    },
  });
}
