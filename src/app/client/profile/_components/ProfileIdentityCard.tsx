"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Camera01Icon, CheckmarkCircle01Icon, AlertCircleIcon, StarIcon } from "@hugeicons/core-free-icons";
import { getInitials, maskEmail, formatGender, formatLastSeen } from "../_utils/profile.utils";
import type { ProfileIdentityCardProps } from "../_props/profile.props";

export function ProfileIdentityCard({ data, onEdit, onAvatarEdit }: ProfileIdentityCardProps) {
  const fullName = `${data.first_name} ${data.last_name}`.trim() || data.username;
  const initials = getInitials(data.first_name, data.last_name);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onAvatarEdit}
            className="relative shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
            aria-label="Change profile picture"
          >
            <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-2 ring-emerald-400 ring-offset-2">
              <AvatarImage src={data.profile_pic_url ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <HugeiconsIcon icon={Camera01Icon} className="h-5 w-5 text-white" strokeWidth={2} />
            </span>
          </button>

          <div className="min-w-0 space-y-0.5">
            <h1 className="text-lg md:text-xl font-semibold text-stone-900 truncate">{fullName}</h1>
            <p className="text-sm text-stone-500">@{data.username}</p>
            <p className="text-sm text-stone-600 truncate">{maskEmail(data.email)}</p>
            {data.phone_number && <p className="text-sm text-stone-500">{data.phone_number}</p>}
            {data.gender && (
              <Badge variant="secondary" className="text-xs mt-1">{formatGender(data.gender)}</Badge>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0 gap-1.5">
          <HugeiconsIcon icon={PencilEdit01Icon} className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </Button>
      </div>

      {/* Status badges */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
        {data.email_verified ? (
          <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" strokeWidth={2} />
            Email Verified
          </Badge>
        ) : (
          <Badge className="gap-1 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <HugeiconsIcon icon={AlertCircleIcon} className="h-3.5 w-3.5" strokeWidth={2} />
            Unverified
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs text-stone-500">
          {formatLastSeen(data.last_login_at)}
        </Badge>
        {data.reward_points > 0 && (
          <Badge className="gap-1 bg-emerald-600 text-white border-0">
            <HugeiconsIcon icon={StarIcon} className="h-3.5 w-3.5 text-yellow-300" strokeWidth={2} />
            {data.reward_points.toLocaleString()} pts
          </Badge>
        )}
      </div>
    </div>
  );
}
