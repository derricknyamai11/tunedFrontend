"use client";

import { useState } from "react";
import { useSettingsQueries } from "./_hooks/useSettingsQueries";
import { SettingsSkeleton } from "./_components/SettingsSkeleton";
import { LocalizationPanel } from "./_components/LocalizationPanel";
import { NotificationPanel } from "./_components/NotificationPanel";
import { EmailPanel } from "./_components/EmailPanel";
import { PrivacyPanel } from "./_components/PrivacyPanel";
import { AccessibilityPanel } from "./_components/AccessibilityPanel";
import { BillingPanel } from "./_components/BillingPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "localization", label: "Localization" },
  { id: "notification", label: "Notifications" },
  { id: "email", label: "Emails & Digests" },
  { id: "privacy", label: "Privacy & Data" },
  { id: "accessibility", label: "Accessibility" },
  { id: "billing", label: "Billing & Invoices" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
  const { settings, isLoading, updateCategory } = useSettingsQueries();
  const [activeTab, setActiveTab] = useState<TabId>("localization");

  if (isLoading || !settings) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="@container/settings flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto py-6">
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold text-emerald-950 mb-6 px-2">Settings</h2>
        <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "justify-start whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-emerald-100/50 text-emerald-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-w-0">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "localization" && (
            <LocalizationPanel data={settings.localization} onUpdate={(p) => updateCategory("localization", p)} />
          )}
          {activeTab === "notification" && (
            <NotificationPanel data={settings.notification} onUpdate={(p) => updateCategory("notification", p)} />
          )}
          {activeTab === "email" && (
            <EmailPanel data={settings.email} onUpdate={(p) => updateCategory("email", p)} />
          )}
          {activeTab === "privacy" && (
            <PrivacyPanel data={settings.privacy} onUpdate={(p) => updateCategory("privacy", p)} />
          )}
          {activeTab === "accessibility" && (
            <AccessibilityPanel data={settings.accessibility} onUpdate={(p) => updateCategory("accessibility", p)} />
          )}
          {activeTab === "billing" && (
            <BillingPanel data={settings.billing} onUpdate={(p) => updateCategory("billing", p)} />
          )}
        </div>
      </div>
    </div>
  );
}
