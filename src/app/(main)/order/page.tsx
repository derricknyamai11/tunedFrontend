import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/services/auth.server.service";

interface PageProps {
  searchParams: Promise<{ service?: string; ref?: string }>;
}

// /order → sends logged-in users to client dashboard, others to login
export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const authResult = await getServerAuthUser();

  if (authResult.ok && authResult.user) {
    // Build redirect with query params so client dashboard can pre-fill the order form
    const qs = new URLSearchParams();
    if (params.service) qs.set("service", params.service);
    if (params.ref) qs.set("ref", params.ref);
    const query = qs.toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    redirect((`/client/orders${query ? `?${query}` : ""}`) as any);
  }

  // Not logged in → go to register with callbackUrl
  const callbackUrl = `/order${params.service ? `?service=${params.service}` : ""}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirect((`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`) as any);
}
