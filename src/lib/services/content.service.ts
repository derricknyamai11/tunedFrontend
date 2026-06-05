import { apiGet } from "@/api-client";
import { FeaturedContentResponseSchema } from "@/lib/schemas";
import type { ApiResult } from "@/lib/types";
import type { FeaturedContentResponse } from "@/app/(main)/_types";

export async function fetchFeaturedContent(): Promise<
  ApiResult<FeaturedContentResponse>
> {
  
  const result = await apiGet<FeaturedContentResponse>("/featured/contents", {
    next: { revalidate: 300, tags: ["featured-content"] },
  });

  if (!result.ok) return result;

  const parsed = FeaturedContentResponseSchema.safeParse(result.data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        message: "Invalid featured content response from server",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        status:    "PARSE_ERROR",
      },
    };
  }

  return {
    ok:   true,
    data: parsed.data as unknown as FeaturedContentResponse,
    message: "Featured services fetched successfully",
    status: 200,
  };
}