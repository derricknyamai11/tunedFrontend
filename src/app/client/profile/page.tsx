"use client";

import { useState } from "react";
import { useProfileQuery } from "./_hooks/useProfileQuery";
import { ProfileIdentityCard } from "./_components/ProfileIdentityCard";
import { ProfileIdentitySkeleton } from "./_components/ProfileIdentitySkeleton";
import { TrustSecurityPanel } from "./_components/TrustSecurityPanel";
import { TrustPanelSkeleton } from "./_components/TrustPanelSkeleton";
import { VerifyEmailBanner } from "./_components/VerifyEmailBanner";
import { AdminIndicator } from "./_components/AdminIndicator";
import { EditProfileSheet } from "./_components/EditProfileSheet";
import { AvatarUploadSheet } from "./_components/AvatarUploadSheet";
import { ChangePasswordModal } from "./_components/ChangePasswordModal";

export default function ProfilePage() {
  const { profile, isLoading } = useProfileQuery();

  const [editOpen, setEditOpen]         = useState(false);
  const [avatarOpen, setAvatarOpen]     = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="@container/profile flex flex-col gap-4 max-w-3xl mx-auto w-full">

      {!isLoading && !profile.email_verified && <VerifyEmailBanner />}

      {!isLoading && <AdminIndicator isAdmin={profile.is_admin} />}

      <div className="md:col-span-2">
        {isLoading ? (
          <ProfileIdentitySkeleton />
        ) : (
          <ProfileIdentityCard
            data={profile}
            onEdit={() => setEditOpen(true)}
            onAvatarEdit={() => setAvatarOpen(true)}
          />
        )}
      </div>

      <div>
        {isLoading ? (
          <TrustPanelSkeleton />
        ) : (
          <TrustSecurityPanel
            data={profile}
            onChangePassword={() => setPasswordOpen(true)}
          />
        )}
      </div>

      <EditProfileSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
      />
      <AvatarUploadSheet
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        currentUrl={profile.profile_pic_url}
      />
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}
