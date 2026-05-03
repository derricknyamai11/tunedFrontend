import type { Profile } from "../_types/profile.types";

export const FALLBACK_PROFILE: Profile = {
  id:                    "00000000-0000-0000-0000-000000000000",
  username:              "loading",
  email:                 "user@example.com",
  first_name:            "",
  last_name:             "",
  gender:                null,
  phone_number:          null,
  profile_pic_url:       null,
  email_verified:        false,
  is_admin:              false,
  reward_points:         0,
  last_login_at:         null,
  failed_login_attempts: 0,
  last_failed_login:     null,
  created_at:            new Date().toISOString(),
};
