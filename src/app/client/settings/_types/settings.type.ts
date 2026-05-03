import { z } from "zod";
import {
  LocalizationSchema,
  NotificationSchema,
  EmailSchema,
  PrivacySchema,
  AccessibilitySchema,
  BillingSchema,
  SettingsSchema,
} from "../_schemas/settings.schema";

export type LocalizationSettings = z.infer<typeof LocalizationSchema>;
export type NotificationSettings = z.infer<typeof NotificationSchema>;
export type EmailSettings = z.infer<typeof EmailSchema>;
export type PrivacySettings = z.infer<typeof PrivacySchema>;
export type AccessibilitySettings = z.infer<typeof AccessibilitySchema>;
export type BillingSettings = z.infer<typeof BillingSchema>;

export type UserSettings = z.infer<typeof SettingsSchema>;

export type SettingsUpdatePayload = {
  localization?: Partial<LocalizationSettings>;
  notification?: Partial<NotificationSettings>;
  email?: Partial<EmailSettings>;
  privacy?: Partial<PrivacySettings>;
  accessibility?: Partial<AccessibilitySettings>;
  billing?: Partial<BillingSettings>;
};
