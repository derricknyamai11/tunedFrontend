"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { resendVerificationEmail } from "../_services/profile.service";

export function VerifyEmailBanner() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setSending(true);
    const res = await resendVerificationEmail();
    setSending(false);
    if (res.ok) {
      setSent(true);
      toast.success("Verification email sent! Check your inbox.");
    } else {
      toast.error("Failed to send. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4 text-amber-600 shrink-0" strokeWidth={2} />
        <p className="text-sm text-amber-800 font-medium truncate">
          Your email address is not verified
        </p>
      </div>
      {!sent ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={sending}
          className="text-amber-700 border-amber-300 hover:bg-amber-100 shrink-0 text-xs"
        >
          <HugeiconsIcon icon={Mail01Icon} className="h-3.5 w-3.5 mr-1" strokeWidth={2} />
          {sending ? "Sending…" : "Verify Now"}
        </Button>
      ) : (
        <span className="text-sm text-amber-600 font-medium shrink-0">Sent ✓</span>
      )}
    </div>
  );
}
