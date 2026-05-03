"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsletterRequestSchema } from "@/lib/schemas/newsletter.schema";
import { subscribeToNewsletter } from "../../_actions/newsletter.action";
import type { NewsletterFormProps } from "../../_props/footer.props";
import type { NewsletterFormStatus } from "../../_types/footer.types";

const DEFAULT_HEADING    = "Stay in the loop";
const DEFAULT_SUBHEADING =
  "Get writing tips, academic guides, and exclusive offers straight to your inbox.";

export function NewsletterForm({
  heading    = DEFAULT_HEADING,
  subheading = DEFAULT_SUBHEADING,
  className,
}: NewsletterFormProps) {
  const inputId  = useId();
  const statusId = useId();

  const [email,  setEmail]  = useState("");
  const [formStatus, setFormStatus] = useState<NewsletterFormStatus>({ status: "idle" });

  const resetToIdle = useCallback(() => {
    setFormStatus({ status: "idle" });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validation = NewsletterRequestSchema.safeParse({ email: email.trim() });
      if (!validation.success) {
        setFormStatus({
          status:  "error",
          message: validation.error.issues[0]?.message ?? "Please enter a valid email.",
        });
        return;
      }

      setFormStatus({ status: "loading" });

      const result = await subscribeToNewsletter(validation.data.email);

      if (result.ok) {
        setFormStatus({
          status:  "success",
          message: result.data.message || "You're subscribed! Check your inbox.",
        });
        setEmail("");
      } else {
        setFormStatus({
          status:  "error",
          message: result.error.message || "Something went wrong. Please try again.",
        });
      }
    },
    [email]
  );

  const isLoading = formStatus.status === "loading";
  const isSuccess = formStatus.status === "success";

  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-200 sm:text-lg">
          {heading}
        </h3>
        <p className="text-sm text-slate-500">{subheading}</p>
      </div>

      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center gap-2 rounded-full",
            "border border-emerald-700/40 bg-emerald-900/20",
            "px-5 py-2.5 text-sm font-medium text-emerald-400"
          )}
        >
          <CheckCircle2 size={15} aria-hidden="true" />
          <span>{formStatus.message}</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={statusId}
          className="w-full max-w-sm"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formStatus.status === "error") resetToIdle();
                }}
                disabled={isLoading}
                aria-invalid={formStatus.status === "error"}
                aria-describedby={statusId}
                className={cn(
                  "w-full rounded-full border px-4 py-2.5 text-sm",
                  "bg-slate-800/60 text-slate-200",
                  "placeholder:text-slate-600",
                  "outline-none transition-all duration-150",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  formStatus.status === "error"
                    ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || email.trim().length === 0}
              aria-busy={isLoading}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full",
                "bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white",
                "transition-all duration-200",
                "hover:bg-emerald-600 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#0f1117]",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {isLoading ? (
                <Loader2 size={14} aria-hidden="true" className="animate-spin" />
              ) : (
                <Send size={14} aria-hidden="true" />
              )}
              <span>{isLoading ? "Sending…" : "Subscribe"}</span>
            </button>
          </div>

          {/* ── Status message (error) ────────────────────────────────── */}
          <div
            id={statusId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-2.5 min-h-[20px]"
          >
            {formStatus.status === "error" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle size={12} aria-hidden="true" />
                {formStatus.message}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
