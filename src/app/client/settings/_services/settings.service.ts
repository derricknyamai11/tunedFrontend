import { apiGet, apiRequest } from "@/api-client";
import { SettingsResponseSchema } from "../_schemas/settings.schema";
import type { UserSettings, SettingsUpdatePayload } from "../_types/settings.type";
import { FALLBACK_SETTINGS } from "../_fallback/settings.fallback";

export async function fetchUserSettings(): Promise<UserSettings> {
  const result = await apiGet<UserSettings>("/client/settings");
  
  if (!result.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Settings] fetch failed:", result.error);
    }
    return FALLBACK_SETTINGS;
  }

  const parsed = SettingsResponseSchema.safeParse({ success: true, data: result.data });
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Settings] validation failed:", parsed.error.format());
    }
    return { ...FALLBACK_SETTINGS, ...(result.data as Partial<UserSettings>) };
  }

  return parsed.data.data;
}

export async function updateUserSettingsCategory<K extends keyof SettingsUpdatePayload>(
  category: K,
  payload: SettingsUpdatePayload[K]
): Promise<boolean> {
  const result = await apiRequest(`/client/settings/${category}`, {
    method: "PATCH",
    body: payload,
  });

  if (!result.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[Settings] Failed to update ${category}:`, result.error);
    }
    return false;
  }

  return true;
}
