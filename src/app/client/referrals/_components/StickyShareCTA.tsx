"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface StickyShareCTAProps {
  referralCode: string;
}

export function StickyShareCTA({ referralCode }: StickyShareCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroShareBtn = document.getElementById("hero-share-btn");
      if (!heroShareBtn) {
        setIsVisible(window.scrollY > 200 && window.innerWidth < 768);
        return;
      }
      
      const rect = heroShareBtn.getBoundingClientRect();
      setIsVisible(rect.bottom < 0 && window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/auth/register?ref=${referralCode}`;
    const shareData = {
      title: "Join me on Tuned",
      text: `Use my referral code ${referralCode} to join Tuned!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.error("Failed to share.", err);
          }
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share.");
        }
      }
    } else {
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

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Button 
        size="lg" 
        className="w-full shadow-xl bg-primary hover:bg-primary/90 rounded-full h-14 text-base font-semibold"
        onClick={handleShare}
      >
        <Share2 className="mr-2 h-5 w-5" />
        Share Referral Link
      </Button>
    </div>
  );
}
