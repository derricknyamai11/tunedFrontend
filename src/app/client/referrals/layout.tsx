import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals | TunedEssays",
  description: "Refer friends and earn rewards!",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}
