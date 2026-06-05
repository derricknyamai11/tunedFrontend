import { apiGet } from "@/api-client";
import { 
  ServiceSchema,
  ServiceCategorySchema, 
  ServiceDetailsSchema, 
  RelatedContentResponseSchema,
  AcademicLevelSchema
} from "@/lib/schemas/service.schema";
import { z } from "zod";
import type { ApiResult } from "@/lib/types";
import type { 
  Service,
  ServiceCategory, 
  ServiceDetails, 
  RelatedContentResponse 
} from "@/lib/types/service.type";
import type { Level, Sample } from "@/lib/types/content.type";

export async function fetchServiceCategories(): Promise<ApiResult<readonly ServiceCategory[]>> {
  const result = await apiGet<unknown>("/services/categories", {
    next: { revalidate: 3600, tags: ["services:categories"] }
  });

  if (!result.ok) return result as ApiResult<readonly ServiceCategory[]>;

  const parsed = z.array(ServiceCategorySchema).safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        message: "Invalid service categories response from server.",
        errors: parsed.error.flatten().fieldErrors as unknown as Record<string, string[]>,
        status: "PARSE_ERROR",
      },
    };
  }

  return {
    ok: true,
    data: parsed.data as readonly ServiceCategory[],
    message: "Service categories fetched successfully",
    status: 200,
  };
}

export async function fetchServicesByCategoryId(categoryId: string): Promise<ApiResult<readonly Service[]>> {
  const result = await apiGet<unknown>(`/services/category/${categoryId}`, {
    next: { revalidate: 300, tags: ["services:categories"] }
  });

  if (!result.ok) return result as ApiResult<readonly Service[]>;

  console.log("RAW SERVICE RESPONSE:", result.data);
  const parsed = z.array(ServiceSchema).safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        message: "Invalid service categories response from server.",
        errors: parsed.error.flatten().fieldErrors as unknown as Record<string, string[]>,
        status: "PARSE_ERROR",
      },
    };
  }

  return {
    ok: true,
    data: parsed.data as readonly Service[],
    message: "Service categories fetched successfully",
    status: 200,
  };
}

export async function fetchServiceBySlug(slug: string): Promise<ApiResult<ServiceDetails>> {
  const result = await apiGet<ServiceDetails>(`/services/${slug}`, {
    next: { revalidate: 3600, tags: [`service:${slug}`] }
  });

  if (!result.ok) return result as ApiResult<ServiceDetails>;

  const parsed = ServiceDetailsSchema.safeParse(result.data);
  if (!parsed.success) {
    // console.error("SERVICE DETAILS PARSE ERROR:", parsed.error.format());
    // console.error("RAW DATA:", result.data);
    return {
      ok: false,
      error: {
        message: "Invalid service details response from server.",
        errors: parsed.error.flatten().fieldErrors as unknown as Record<string, string[]>,
        status: "PARSE_ERROR",
      },
    };
  }

  return {
    ok: true,
    data: parsed.data as unknown as ServiceDetails,
    message: "Service details fetched successfully",
    status: 200,
  };
}

export async function fetchRelatedContent(serviceId: string): Promise<ApiResult<RelatedContentResponse>> {
  const result = await apiGet<unknown>(`/services/${serviceId}/related`, {
    next: { revalidate: 3600 }
  });

  if (!result.ok) return result as ApiResult<RelatedContentResponse>;

  const parsed = RelatedContentResponseSchema.safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        message: "Invalid related content response from server.",
        errors: parsed.error.flatten().fieldErrors as unknown as Record<string, string[]>,
        status: "PARSE_ERROR",
      },
    };
  }

  const data: RelatedContentResponse = {
    services: parsed.data.services as readonly Service[],
    /* TODO check on sample return schema */
    samples: parsed.data.samples.map(s => ({
      ...s,
      service_id: s.service?.id || "",
    })) as unknown as readonly Sample[],
  };

  return {
    ok: true,
    data,
    message: "Related content fetched successfully",
    status: 200,
  };
}

export async function fetchAcademicLevels(): Promise<ApiResult<readonly Level[]>> {
  const result = await apiGet<unknown>("/academic-levels", {
    next: { revalidate: 300 } // Cache for 24 hours
  });

  if (!result.ok) return result as ApiResult<readonly Level[]>;

  const parsed = z.array(AcademicLevelSchema).safeParse(result.data);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        message: "Invalid academic levels response from server.",
        errors: parsed.error.flatten().fieldErrors as unknown as Record<string, string[]>,
        status: "PARSE_ERROR",
      },
    };
  }

  return {
    ok: true,
    data: parsed.data as readonly Level[],
    message: "Academic levels fetched successfully",
    status: 200,
  };
}
