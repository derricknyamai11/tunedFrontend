import { apiGet, apiRequest } from "@/api-client";
import type { ApiResult } from "@/lib/types";
import { ProfileSchema, AvatarUploadResponseSchema } from "../_schemas/profile.schema";
import type { Profile, UpdateProfileData, AvatarUploadResponse } from "../_types/profile.types";

const PARSE_ERROR: ApiResult<never> = {
  ok: false,
  error: { message: "Response validation failed", errors: {}, status: 422 },
};

function logErr(ep: string, e: unknown): void {
  if (process.env.NODE_ENV !== "production")
    console.error(`[ProfileService] ${ep} schema violation:`, e);
}

export async function fetchProfile(): Promise<ApiResult<Profile>> {
  const res = await apiGet<unknown>("/client/profile");
  if (!res.ok) return { ok: false, error: res.error };
  const p = ProfileSchema.safeParse(res.data);
  if (!p.success) { logErr("GET /client/profile", p.error.format()); return PARSE_ERROR; }
  return { ok: true, data: p.data, message: res.message, status: res.status };
}

export async function updateProfile(data: UpdateProfileData): Promise<ApiResult<Profile>> {
  const res = await apiRequest<unknown>("/client/profile", { method: "PATCH", body: data });
  if (!res.ok) return { ok: false, error: res.error };
  const p = ProfileSchema.safeParse(res.data);
  if (!p.success) { logErr("PATCH /client/profile", p.error.format()); return PARSE_ERROR; }
  return { ok: true, data: p.data, message: res.message, status: res.status };
}

export async function uploadAvatar(file: File): Promise<ApiResult<AvatarUploadResponse>> {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await fetch("/api/client/profile/avatar", {
      method: "POST", credentials: "include", body: form,
    });
    if (!res.ok) return { ok: false, error: { message: res.statusText, errors: {}, status: res.status } };
    const json: unknown = await res.json();
    const p = AvatarUploadResponseSchema.safeParse(json);
    if (!p.success) { logErr("POST avatar", p.error); return PARSE_ERROR; }
    return { ok: true, data: p.data, message: "Avatar updated", status: res.status };
  } catch {
    return { ok: false, error: { message: "Upload failed", errors: {}, status: "NETWORK_ERROR" } };
  }
}

export async function deleteAvatar(): Promise<ApiResult<AvatarUploadResponse>> {
  const res = await apiRequest<unknown>("/client/profile/avatar", { method: "DELETE" });
  if (!res.ok) return { ok: false, error: res.error };
  const p = AvatarUploadResponseSchema.safeParse(res.data);
  if (!p.success) { logErr("DELETE avatar", p.error); return PARSE_ERROR; }
  return { ok: true, data: p.data, message: res.message, status: res.status };
}

export async function resendVerificationEmail(): Promise<ApiResult<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>("/client/profile/verify-email", { method: "POST", body: {} });
}

export async function changePassword(
  d: { current_password: string; new_password: string },
): Promise<ApiResult<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>("/client/profile/change-password", { method: "POST", body: d });
}
