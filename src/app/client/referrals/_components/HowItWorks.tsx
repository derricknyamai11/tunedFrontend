"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserPlus, ShoppingBag, Coins, TrendingUp } from "lucide-react";

export function HowItWorks() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="how-it-works" className="border-border/50">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          How It Works
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <div className="hidden sm:block absolute top-6 left-1/6 right-1/6 h-0.5 bg-border/50 z-0" />
            
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">1. Invite a Friend</h4>
                <p className="text-xs text-muted-foreground mt-1">Share your unique code.</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">2. They Order</h4>
                <p className="text-xs text-muted-foreground mt-1">Friend places a $40+ paid order.</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">3. Earn Points</h4>
                <p className="text-xs text-muted-foreground mt-1">You get points (1 pt = $0.40).</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-5 border border-border/50 mt-6 flex gap-4 items-start">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Tier Rules (Monthly)</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4 marker:text-primary/50">
                <li><strong className="text-foreground">1 referral:</strong> 10 points per referral</li>
                <li><strong className="text-foreground">2-4 referrals:</strong> 12 points per referral</li>
                <li><strong className="text-foreground">5+ referrals:</strong> 15 points per referral</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
