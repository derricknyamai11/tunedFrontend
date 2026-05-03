"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile } from "../_services/profile.service";
import { PROFILE_QUERY_KEY } from "./useProfileQuery";
import type { Profile, UpdateProfileData } from "../_types/profile.types";

export function useProfileMutation(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const res = await updateProfile(data);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const prev = qc.getQueryData<Profile>(PROFILE_QUERY_KEY);
      qc.setQueryData<Profile>(PROFILE_QUERY_KEY, (old) =>
        old ? { ...old, ...vars } : old,
      );
      return { prev };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.prev) qc.setQueryData(PROFILE_QUERY_KEY, ctx.prev);
      toast.error(err.message ?? "Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      onSuccess?.();
    },
  });
}
