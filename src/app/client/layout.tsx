import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/lib/auth/Context";
import type { AuthUser } from "@/lib/types/auth.type";
import { getServerAuthUser } from "@/lib/services/auth.server.service";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ClientSidebar } from "./_components/ClientSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "./_components/DashboardHeader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata = {
  title: "Client Portal | TunedEssays",
  description: "Manage your orders and dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await getServerAuthUser();
  const initialUser: AuthUser | null = authResult.ok ? authResult.user : null;

  return (
    <html lang="en" className={dmSans.variable} data-scroll-behavior="smooth">
      <body className={`${dmSans.className} antialiased bg-[#e8e6e1]`}>
         <AuthProvider initialUser={initialUser} skipInitialFetch={initialUser !== null}>
          <QueryProvider>
          <NotificationProvider>
            <TooltipProvider delayDuration={300}>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 64)",
                    "--header-height": "calc(var(--spacing) * 16)",
                  } as React.CSSProperties
                }
              >
                <ClientSidebar user={initialUser} />
                <SidebarInset>
                  <DashboardHeader />
                  <div className="flex flex-1 flex-col p-4 md:p-8">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
            <Toaster position="top-center" richColors theme="light" />
          </NotificationProvider>
          </QueryProvider>
         </AuthProvider>
      </body>
    </html>
  );
}
