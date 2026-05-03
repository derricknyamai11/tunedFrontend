import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/lib/auth/Context";
import { AuthUser } from "@/lib/types/auth.type";
import { getServerAuthUser } from "@/lib/services/auth.server.service";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "TunedEssays – Your Trusted Writer & Editor",
  description:
    "AI & Plagiarism-free professional writing, proofreading, editing, and technical writing services. Get a custom quote instantly.",
  keywords: [
    "essay writing",
    "proofreading",
    "editing",
    "academic writing",
    "dissertation",
    "research paper",
  ],
  openGraph: {
    title: "TunedEssays – Your Trusted Writer & Editor",
    description: "AI & Plagiarism-free professional writing services.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await getServerAuthUser();
  const initialUser: AuthUser | null = authResult.ok ? authResult.user : null;

  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
         <AuthProvider initialUser={initialUser} skipInitialFetch={initialUser !== null}>
          <QueryProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-center" richColors theme="light" />
            </NotificationProvider>
          </QueryProvider>
         </AuthProvider>
      </body>
    </html>
  );
}
