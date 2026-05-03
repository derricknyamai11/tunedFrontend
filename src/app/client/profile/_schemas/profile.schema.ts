import { z } from "zod";

export const GenderSchema = z.enum(["male", "female", "unknown"]);

export const ProfileSchema = z.object({
  id:                    z.string().uuid(),
  username:              z.string(),
  email:                 z.string().email(),
  first_name:            z.string(),
  last_name:             z.string(),
  gender:                GenderSchema.nullable(),
  phone_number:          z.string().nullable(),
  profile_pic_url:       z.string().nullable(),
  email_verified:        z.boolean(),
  is_admin:              z.boolean(),
  reward_points:         z.number(),
  last_login_at:         z.string().nullable(),
  failed_login_attempts: z.number(),
  last_failed_login:     z.string().nullable(),
  created_at:            z.string(),
});

export const UpdateProfileSchema = z.object({
  first_name:   z.string().min(1, "First name is required").max(100),
  last_name:    z.string().min(1, "Last name is required").max(100),
  phone_number: z.string().max(20).nullable().optional(),
  gender:       GenderSchema.nullable().optional(),
});

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password:     z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const AvatarUploadResponseSchema = z.object({
  profile_pic_url: z.string().nullable(),
});
