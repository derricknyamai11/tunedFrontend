"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../_services/profile.service";
import { FALLBACK_PROFILE } from "../_fallback/profile.fallback";
import type { Profile } from "../_types/profile.types";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export interface UseProfileQueryReturn {
  readonly profile:   Profile;
  readonly isLoading: boolean;
  readonly isError:   boolean;
  readonly refetch:   () => void;
}

export function useProfileQuery(): UseProfileQueryReturn {
  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchProfile();
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    },
    placeholderData: FALLBACK_PROFILE,
    staleTime: 2 * 60 * 1000,
  });

  return {
    profile:   query.data ?? FALLBACK_PROFILE,
    isLoading: query.isLoading,
    isError:   query.isError,
    refetch:   query.refetch,
  };
}
