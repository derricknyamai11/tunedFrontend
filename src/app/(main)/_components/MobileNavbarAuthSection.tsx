"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0]![0] ?? "?").toUpperCase();
  return (
    (parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")
  ).toUpperCase();
}

export function MobileNavbarAuthSection(): React.ReactElement {
  const { status, user, logoutAndRefresh } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAndRefresh();
    setIsLoggingOut(false);
    router.push("/");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-3" aria-hidden="true">
        <div className="h-14 w-full rounded-2xl bg-slate-100 animate-pulse" />
        <div className="h-14 w-full rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (status === "authenticated" && user !== null) {
    const initials = getInitials(user.name);

    return (
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-slate-100",
            "bg-slate-50 px-4 py-3",
          )}
        >
          <Avatar className="h-10 w-10 shrink-0">
            {user.avatar_url && (
              <AvatarImage src={user.avatar_url} alt={user.name} />
            )}
            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <NotificationBell />
        </div>

        <Button
          variant="outline"
          className="w-full h-14 border-slate-200 text-slate-700 font-bold rounded-2xl text-base justify-start gap-3 pl-5"
          asChild
        >
          <Link href={{pathname: "/client"}}>
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </Link>
        </Button>

        {/* Order Now */}
        <Button
          className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-base shadow-xl shadow-emerald-500/10"
          asChild
        >
          <Link href={"/order" as never}>Order Now</Link>
        </Button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2",
            "text-sm font-semibold text-red-500 hover:text-red-600",
            "transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {isLoggingOut ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <LogOut size={15} aria-hidden="true" />
          )}
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="w-full h-14 border-slate-200 text-slate-700 font-bold rounded-2xl text-base"
        asChild
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-base shadow-xl shadow-emerald-500/10"
        asChild
      >
        <Link href={"/order" as never}>Order Now</Link>
      </Button>
    </div>
  );
}
