export interface RegisterFormValues {
  readonly username: string;
  readonly name: string;
  readonly gender: "M" | "F" | "";
  readonly password: string;
  readonly confirmPassword: string;
  readonly email: string;
  readonly phone: string;
}

export type RegisterFieldErrors = Partial<
  Record<keyof RegisterFormValues, string>
>;

export type RegisterResult =
  | { readonly ok: true; readonly email: string; readonly auto_verified?: boolean }
  | {
      readonly ok: false;
      readonly message: string;
      readonly fieldErrors?: RegisterFieldErrors;
      readonly status: number | string;
    };

export type RegisterFormStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export interface RegisterFormState {
  readonly status: RegisterFormStatus;
  readonly globalError: string | null;
  readonly fieldErrors: RegisterFieldErrors;
}

export interface RegisterFormProps {
  readonly callbackUrl: string;
}

export interface RegisterLeftPanelProps {
  readonly showIllustration?: boolean;
}
