import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | TunedEssays",
  description: "Configure your notifications, security, and account settings.",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}
