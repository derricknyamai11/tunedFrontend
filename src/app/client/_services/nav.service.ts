import { apiGet } from "@/api-client";
import type { ApiResult } from "@/lib/types";
import { NavStatsSchema } from "../_schemas/nav.schema";
import type { NavStats } from "../_types/nav.type";

export async function fetchNavStats(): Promise<ApiResult<NavStats>> {
  const res = await apiGet<unknown>("/client/nav-stats");

  if (!res.ok) return { ok: false, error: res.error };

  const parsed = NavStatsSchema.safeParse(res.data);

  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[NavService] /client/nav-stats schema violation:",
        parsed.error.format(),
      );
    }
    return {
      ok: false,
      error: {
        message: "Nav stats response failed validation",
        errors: {},
        status: 422,
      },
    };
  }

  return { ok: true, data: parsed.data, message: res.message, status: res.status };
}
