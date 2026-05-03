"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAvatar, deleteAvatar } from "../_services/profile.service";
import { PROFILE_QUERY_KEY } from "./useProfileQuery";
import type { Profile } from "../_types/profile.types";

export function useUploadAvatarMutation(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const res = await uploadAvatar(file);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData<Profile>(PROFILE_QUERY_KEY, (old) =>
        old ? { ...old, profile_pic_url: data.profile_pic_url } : old,
      );
      toast.success("Profile picture updated");
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message ?? "Upload failed"),
  });
}

export function useDeleteAvatarMutation(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await deleteAvatar();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData<Profile>(PROFILE_QUERY_KEY, (old) =>
        old ? { ...old, profile_pic_url: data.profile_pic_url } : old,
      );
      toast.success("Profile picture removed");
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to remove picture"),
  });
}
