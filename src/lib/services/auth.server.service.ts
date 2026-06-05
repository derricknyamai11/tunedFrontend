import "server-only";

import { cookies } from "next/headers";
import { apiGet } from "@/api-client";
import { AuthMeResponseSchema } from "@/lib/schemas/auth.schema";
import type { AuthUser, ServerAuthResult } from "@/lib/types/auth.type";
import type { ApiResult } from "@/lib/types";

function parseAuthMeResult(result: ApiResult<unknown>): ServerAuthResult {
  if (!result.ok) {
    const status = result.error.status;

    if (status === 401 || status === 403) {
      return { ok: false, reason: "unauthenticated" };
    }

    return { ok: false, reason: "network_error" };
  }

  const parsed = AuthMeResponseSchema.safeParse(result.data);

  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[Auth/Server] /api/auth/me schema violation:",
        parsed.error.format(),
      );
      console.error("[Auth/Server] Raw response:", result.data);
    }
    return { ok: false, reason: "parse_error" };
  }

  return { ok: true, user: parsed.data as AuthUser };
}

export async function getServerAuthUser(): Promise<ServerAuthResult> {
  try {
    const cookieStore = await cookies();

    // Build a proper "name=value; name2=value2" cookie header string.
    // cookieStore.toString() returns "[object Object]" — do NOT use it.
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Also try passing the JWT access token as Authorization header
    // (Flask-JWT-Extended reads from both headers and cookies)
    const jwtCookie = allCookies.find(
      (c) => c.name === "tuned_access_token" || c.name === "access_token_cookie"
    );

    const extraHeaders: Record<string, string> = {};
    if (cookieHeader) extraHeaders["Cookie"] = cookieHeader;
    if (jwtCookie) extraHeaders["Authorization"] = `Bearer ${jwtCookie.value}`;

    const result = await apiGet<unknown>("/auth/me", {
      cache: "no-store",
      headers: Object.keys(extraHeaders).length ? extraHeaders : undefined,
    });

    return parseAuthMeResult(result);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Auth/Server] Unexpected error in getServerAuthUser:", err);
    }
    return { ok: false, reason: "network_error" };
  }
}
