import type { NavStats } from "../_schemas/nav.schema";

export interface NavStatsState {
  readonly activeOrdersCount: number;
  readonly balance: number;
  readonly isLoading: boolean;
}

export type { NavStats };
