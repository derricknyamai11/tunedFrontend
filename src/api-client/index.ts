import type { ApiResult, RequestOptions } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api"; // 

const DEFAULT_TIMEOUT_MS = 15_000;
const UNEXPECTED_ERROR = "An unexpected error occurred"
const BASE_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith("http")) {
    return normalizedPath;
  }
  return `${API_BASE_URL}${normalizedPath}`;
}

function buildHeaders(extra?: HeadersInit): HeadersInit {
  return extra ? { ...BASE_HEADERS, ...extra} : BASE_HEADERS;
}

async function parseErrorBody(res: Response): Promise<ApiResult<never>> {
  try {
    const body = await res.json();
    return {
      ok: false,
      error: {
        message: body?.message ?? body?.detail ?? res.statusText,
        errors: body?.errors ?? { "": [] },
        status: body?.code ?? res.status,
      },
    };
  } catch {
    return {
      ok: false,
      error: {
        message: res.statusText,
        status: res.status,
        errors: { "": [] },
      },
    };
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const {
    method = "GET",
    body,
    headers,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    next,
    credentials = "include",
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(buildUrl(path), {
      method,
      headers: buildHeaders(headers),
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials,
      ...(next ? { next } : {}),
    });

    if (!res.ok) {
      clearTimeout(timeoutId);
      return await parseErrorBody(res);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      clearTimeout(timeoutId);
      return {
        ok: true,
        data: undefined as unknown as T,
        message: res.statusText,
        status: res.status,
      };
    }

    const jsonBody = await res.json();
    clearTimeout(timeoutId);
    
    let data: T = null as T;
    let message = res.statusText;

    if (jsonBody && typeof jsonBody === "object" && jsonBody.success === true && "data" in jsonBody) {
      if ("pagination" in jsonBody) {
        data = jsonBody as T;
      } else {
        data = jsonBody.data as T;
      }
      
      if (typeof jsonBody.message === "string") message = jsonBody.message;
    } else {
      data = jsonBody as T;
    }

    return {
      ok: true,
      data,
      message,
      status: res.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        error: { 
          message: "Request timed out",
          errors: { "": [] },
          status: "TIMEOUT"
        },
      };
    }

    return {
      ok: false,
      error: {
        message: UNEXPECTED_ERROR,
        errors: err instanceof Error ? { "": [err.message] } : { "": [UNEXPECTED_ERROR] },
        status: "NETWORK_ERROR",
      },
    };
  }
}


export const apiGet = <T>(
  path: string,
  opts?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResult<T>> => apiRequest<T>(path, { ...opts, method: "GET" });

export const apiPost = <T>(
  path: string,
  body: unknown,
  opts?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResult<T>> =>
  apiRequest<T>(path, { ...opts, method: "POST", body });

export const apiPatch = <T>(
  path: string,
  body: unknown,
  opts?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResult<T>> =>
  apiRequest<T>(path, { ...opts, method: "PATCH", body });

export const apiDelete = <T>(
  path: string,
  opts?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResult<T>> =>
  apiRequest<T>(path, { ...opts, method: "DELETE" });
