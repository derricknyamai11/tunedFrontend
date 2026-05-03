import { z } from "zod";
import type * as S from "../_schemas/profile.schema";

export type Gender              = z.infer<typeof S.GenderSchema>;
export type Profile             = z.infer<typeof S.ProfileSchema>;
export type UpdateProfileData   = z.infer<typeof S.UpdateProfileSchema>;
export type ChangePasswordData  = z.infer<typeof S.ChangePasswordSchema>;
export type AvatarUploadResponse = z.infer<typeof S.AvatarUploadResponseSchema>;
