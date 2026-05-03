import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserSettings, updateUserSettingsCategory } from "../_services/settings.service";
import type { SettingsUpdatePayload, UserSettings } from "../_types/settings.type";
import { toast } from "sonner";
import { useEffect } from "react";
import { webSocketService } from "@/lib/services/websocket.service";

export function useSettingsQueries() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["client-settings"],
    queryFn: fetchUserSettings,
    staleTime: Infinity,
  });

  useEffect(() => {
    const socket = webSocketService.connect();

    const handleSettingsUpdated = (data: { category: keyof UserSettings; payload: SettingsUpdatePayload[keyof SettingsUpdatePayload] }) => {
      queryClient.setQueryData<UserSettings>(["client-settings"], (old) => {
        if (!old) return old;
        return {
          ...old,
          [data.category]: {
            ...old[data.category],
            ...data.payload,
          },
        };
      });
    };

    socket.on("settings_updated", handleSettingsUpdated);

    return () => {
      socket.off("settings_updated", handleSettingsUpdated);
    };
  }, [queryClient]);

  const mutation = useMutation({
    mutationFn: async ({ category, payload }: { category: keyof SettingsUpdatePayload; payload: SettingsUpdatePayload[keyof SettingsUpdatePayload] }) => {
      const success = await updateUserSettingsCategory(category, payload);
      if (!success) throw new Error("Failed to update settings");
      return { category, payload };
    },
    onMutate: async ({ category, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["client-settings"] });
      const previousSettings = queryClient.getQueryData<UserSettings>(["client-settings"]);

      if (previousSettings) {
        queryClient.setQueryData<UserSettings>(["client-settings"], (old) => {
          if (!old) return old;
          return {
            ...old,
            [category]: {
              ...old[category],
              ...payload,
            },
          };
        });
      }

      return { previousSettings };
    },
    onError: (err, variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(["client-settings"], context.previousSettings);
      }
      if (process.env.NODE_ENV === "development") {
        console.error(`Failed to update settings - ${err}, ${variables}`);
      }
      toast.error("Failed to update settings. Changes reverted.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["client-settings"] });
    },
  });

  const updateCategory = <K extends keyof SettingsUpdatePayload>(category: K, payload: SettingsUpdatePayload[K]) => {
    mutation.mutate({ category, payload });
  };

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    updateCategory,
  };
}
