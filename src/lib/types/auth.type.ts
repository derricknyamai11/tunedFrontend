export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar_url: string | null;
  readonly session_created_at: string | null;
  readonly is_admin: boolean;
  readonly is_writer?: boolean;
}

export type AuthStatus =
  | "loading"           // Initial check in flight — no decision yet
  | "authenticated"     // /api/auth/me returned a valid user
  | "unauthenticated"   // /api/auth/me returned 401/403 or user is null
  | "error";            // Network failure or unexpected server error

export interface AuthState {
  readonly status: AuthStatus;
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
}

export type ServerAuthResult =
  | { readonly ok: true;  readonly user: AuthUser }
  | { readonly ok: false; readonly reason: "unauthenticated" | "network_error" | "parse_error" };

export type AuthContextValue = AuthState;