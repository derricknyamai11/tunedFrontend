import { z } from "zod";

export const NavStatsSchema = z.object({
  active_orders: z.number().int().nonnegative(),
  balance: z.number().nonnegative(),
});

export type NavStats = z.infer<typeof NavStatsSchema>;
