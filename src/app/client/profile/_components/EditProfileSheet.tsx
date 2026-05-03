"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ProfileEditForm } from "./ProfileEditForm";
import type { EditProfileSheetProps } from "../_props/profile.props";

export function EditProfileSheet({ open, onClose, profile }: EditProfileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[92svh] overflow-y-auto md:side-right"
      >
        <SheetHeader className="mb-5">
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Update your personal information below.
          </SheetDescription>
        </SheetHeader>
        <ProfileEditForm profile={profile} onSuccess={onClose} />
      </SheetContent>
    </Sheet>
  );
}
