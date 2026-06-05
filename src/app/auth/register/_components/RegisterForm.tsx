"use client";

import React, { ChangeEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegisterFormProps } from "@/lib/types/register.type";
import { useRegisterForm } from "../_hooks/useRegisterForm";
import { RegisterField } from "./RegisterField";
import { RegisterSubmitButton } from "./RegisterSubmitButton";
import { GenderSelect } from "./GenderSelect";
import { PhoneInput } from "./PhoneInput";

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const {
    formId,
    formValues,
    handleChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formStatus,
    globalError,
    fieldErrors,
    isSubmitting,
    isSuccess,
    handleBlur,
    handleSubmit,
  } = useRegisterForm(callbackUrl);

  const getErrorId = (field: string) => (fieldErrors[field as keyof typeof fieldErrors] ? `${formId}-${field}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Create Account" className="flex flex-col gap-4">
      {globalError && formStatus === "error" && (
        <div role="alert" aria-live="assertive" className="flex items-start gap-3 rounded-xl px-4 py-3 border border-red-200 bg-red-50">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
          <p className="text-sm font-medium text-red-700">{globalError}</p>
        </div>
      )}
      {isSuccess && (
        <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl px-4 py-3 border border-emerald-200 bg-emerald-50">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium text-emerald-700">Account created successfully. Redirecting…</p>
        </div>
      )}

      <RegisterField id={`${formId}-username`} label="Username" required error={fieldErrors.username}>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id={`${formId}-username`}
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={formValues.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("username", e.target.value)}
            onBlur={() => handleBlur("username")}
            placeholder="Username"
            aria-invalid={!!fieldErrors.username}
            aria-describedby={getErrorId("username")}
            disabled={isSubmitting || isSuccess}
            maxLength={50}
            className={cn(
               "w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
               fieldErrors.username ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            )}
          />
        </div>
      </RegisterField>

      <div className="grid grid-cols-[1fr_100px] gap-3">
        <RegisterField id={`${formId}-name`} label="Name" required error={fieldErrors.name}>
          <div className="relative">
            <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id={`${formId}-name`}
              type="text"
              autoComplete="name"
              value={formValues.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Full Name"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={getErrorId("name")}
              disabled={isSubmitting || isSuccess}
              maxLength={100}
              className={cn(
                 "w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
                 fieldErrors.name ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              )}
            />
          </div>
        </RegisterField>

        <RegisterField id={`${formId}-gender`} label="Gender" required error={fieldErrors.gender}>
          <GenderSelect
            value={formValues.gender as "M" | "F" | ""}
            onChange={(val) => {
               handleChange("gender", val);
               setTimeout(() => handleBlur("gender"), 0);
            }}
            disabled={isSubmitting || isSuccess}
          />
        </RegisterField>
      </div>

      {/* Password Field */}
      <RegisterField id={`${formId}-password`} label="Password" required error={fieldErrors.password}>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id={`${formId}-password`}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formValues.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => { handleBlur("password"); if (formValues.confirmPassword) handleBlur("confirmPassword"); }}
            placeholder="••••••••"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={getErrorId("password")}
            disabled={isSubmitting || isSuccess}
            maxLength={256}
            className={cn(
               "w-full rounded-xl border bg-white py-2.5 pl-10 pr-11 text-sm text-slate-800 placeholder:text-slate-500 outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
               fieldErrors.password ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide" : "Show"}
            aria-pressed={showPassword}
            disabled={isSubmitting || isSuccess}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
          >
            {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        </div>
      </RegisterField>

      <RegisterField id={`${formId}-confirmPassword`} label="Confirm password" required error={fieldErrors.confirmPassword}>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id={`${formId}-confirmPassword`}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formValues.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            placeholder="••••••••••••"
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={getErrorId("confirmPassword")}
            disabled={isSubmitting || isSuccess}
            maxLength={256}
            className={cn(
               "w-full rounded-xl border bg-white py-2.5 pl-10 pr-11 text-sm text-slate-800 placeholder:text-slate-500 outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
               fieldErrors.confirmPassword ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide" : "Show"}
            aria-pressed={showConfirmPassword}
            disabled={isSubmitting || isSuccess}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
          >
            {showConfirmPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        </div>
      </RegisterField>

      <RegisterField id={`${formId}-email`} label="Email" required error={fieldErrors.email}>
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={formValues.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="your@email.xyz"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={getErrorId("email")}
              disabled={isSubmitting || isSuccess}
              maxLength={254}
              className={cn(
                 "w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
                 fieldErrors.email ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              )}
            />
          </div>
          <p className="text-[13px] text-slate-500 font-medium ml-1">We&apos;ll send a verification to this email</p>
        </div>
      </RegisterField>

      <RegisterField id={`${formId}-phone`} label="Phone Number" required error={fieldErrors.phone}>
        <PhoneInput
           id={`${formId}-phone`}
           value={formValues.phone}
           onChange={(val) => { handleChange("phone", val || ""); setTimeout(() => handleBlur("phone"), 0); }}
           onBlur={() => handleBlur("phone")}
           disabled={isSubmitting || isSuccess}
           error={!!fieldErrors.phone}
           aria-invalid={!!fieldErrors.phone}
           aria-describedby={getErrorId("phone")}
        />
      </RegisterField>

      {/* Account type note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-800 mb-1">📌 Account Types</p>
        <p><span className="font-semibold text-emerald-700">Client:</span> Registering here creates a client account — you can place orders, track progress, and message writers.</p>
        <p className="mt-1"><span className="font-semibold text-slate-700">Writer?</span> Register as a client first, then <a href="/contact" className="text-emerald-700 underline font-semibold">apply to join as a writer</a> via our contact page. Our team reviews applications and grants writer access.</p>
      </div>

      <RegisterSubmitButton isSubmitting={isSubmitting} isSuccess={isSuccess} />

      <p className="text-center text-[15px] text-slate-700 mt-2 font-medium">
        Already have an account? <Link href={{pathname:"/auth/login"}} className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors">Sign in</Link>
      </p>
      <p className="text-left text-[11px] leading-relaxed text-slate-500 mt-1">
        By signing in, you agree to Tunedessays&apos; <Link href={{pathname:"/terms"}} className="text-emerald-600 hover:underline transition-colors">Terms of Service</Link> and acknowledge our <Link href={{pathname:"/privacy"}} className="text-emerald-600 hover:underline transition-colors">Privacy Policy</Link>. You may occasionally receive important updates, writing tips, or exclusive offers from our team. Our commitment to protecting your personal information stems from our respect for your privacy.
      </p>
    </form>
  );
}
