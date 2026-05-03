"use client";

import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../_utils/referral.utils";

interface HeroSummaryCardProps {
  balance: number;
  referralCode: string;
}

export function HeroSummaryCard({ balance, referralCode }: HeroSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to copy code.", err);
      }
      toast.error("Failed to copy code.");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/auth/register?ref=${referralCode}`;
    const shareData = {
      title: "Join me on Tuned",
      text: `Use my referral code ${referralCode} to join Tuned!`,
      url: shareUrl,
    };

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share.");
        }
      }
    } else {
      // Fallback for desktop or unsupported browsers
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to copy share link.", err);
        }
        toast.error("Failed to copy share link.");
      }
    }
  };

  const usdValue = balance * 0.40;

  return (
    <Card className="w-full bg-linear-to-br from-primary/10 via-background to-primary/5 border-primary/20 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none" />
      
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Reward Balance
          </p>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-5xl md:text-6xl font-black text-foreground tracking-tight">
              {balance}
            </span>
            <span className="text-xl font-semibold text-muted-foreground">pts</span>
          </div>
          <p className="text-sm text-emerald-500 font-medium">
            ≈ {formatCurrency(usdValue)} value
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleCopy}
            className="flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 group"
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
            )}
            <span className="font-mono tracking-widest font-bold">{referralCode}</span>
          </Button>

          <Button 
            size="lg"
            onClick={handleShare}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
