import type { ReactNode } from "react";
import type { Profile } from "../_types/profile.types";

export interface ProfileIdentityCardProps {
  readonly data:          Profile;
  readonly onEdit:        () => void;
  readonly onAvatarEdit:  () => void;
}

export interface TrustSecurityPanelProps {
  readonly data:              Profile;
  readonly onChangePassword:  () => void;
}

export interface EditProfileSheetProps {
  readonly open:    boolean;
  readonly onClose: () => void;
  readonly profile: Profile;
}

export interface ChangePasswordModalProps {
  readonly open:    boolean;
  readonly onClose: () => void;
}

export interface AvatarUploadSheetProps {
  readonly open:       boolean;
  readonly onClose:    () => void;
  readonly currentUrl: string | null;
}

export interface AdminIndicatorProps {
  readonly isAdmin: boolean;
}

export interface ProfilePageProps {
  readonly children?: ReactNode;
}
