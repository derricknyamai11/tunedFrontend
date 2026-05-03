"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { webSocketService } from "@/lib/services/websocket.service";

export function useReferralSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = webSocketService.connect();

    socket.on("dashboard:points_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["referrals", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["referrals", "history"] });
    });

    return () => {
      socket.off("dashboard:points_updated");
    };
  }, [queryClient]);
}
