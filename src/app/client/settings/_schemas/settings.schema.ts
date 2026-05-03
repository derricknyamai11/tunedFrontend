import { z } from "zod";

export const LocalizationSchema = z.object({
  language: z.string(),
  country_code: z.string().nullable(),
  timezone: z.string(),
  date_format: z.string(),
  time_format: z.string(),
  currency: z.string(),
  number_format: z.string(),
  week_start: z.string(),
});

export const NotificationSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  push_notifications: z.boolean(),
  order_updates: z.boolean(),
  payment_notifications: z.boolean(),
  delivery_notifications: z.boolean(),
  revision_updates: z.boolean(),
  extension_updates: z.boolean(),
  comment_notifications: z.boolean(),
  support_ticket_updates: z.boolean(),
  marketing_emails: z.boolean(),
  weekly_summary: z.boolean(),
});

export const EmailSchema = z.object({
  newsletter: z.boolean(),
  promotional_emails: z.boolean(),
  product_updates: z.boolean(),
  order_confirmations: z.boolean(),
  payment_receipts: z.boolean(),
  account_security: z.boolean(),
  frequency: z.string(),
  daily_digest_hour: z.number().nullable(),
});

export const PrivacySchema = z.object({
  profile_visibility: z.string(),
  show_email: z.boolean(),
  show_phone: z.boolean(),
  show_name: z.boolean(),
  allow_messages: z.boolean(),
  allow_comments: z.boolean(),
  data_sharing: z.boolean(),
  analytics_tracking: z.boolean(),
  third_party_cookies: z.boolean(),
  allow_search_engine_indexing: z.boolean(),
});

export const AccessibilitySchema = z.object({
  font_size_multiplier: z.number(),
  text_spacing_increased: z.boolean(),
  high_contrast_mode: z.boolean(),
  color_blind_mode: z.boolean(),
  reduced_motion: z.boolean(),
  screen_reader_optimized: z.boolean(),
  keyboard_navigation_enhanced: z.boolean(),
  focus_indicators_enhanced: z.boolean(),
});

export const BillingSchema = z.object({
  invoice_email: z.string().nullable(),
  invoice_delivery: z.string(),
  payment_reminders: z.boolean(),
  reminder_days_before: z.number(),
  auto_reload_enabled: z.boolean().nullable(),
  auto_reload_threshold: z.number().nullable(),
});

export const SettingsSchema = z.object({
  localization: LocalizationSchema,
  notification: NotificationSchema,
  email: EmailSchema,
  privacy: PrivacySchema,
  accessibility: AccessibilitySchema,
  billing: BillingSchema,
});

export const SettingsResponseSchema = z.object({
  success: z.boolean(),
  data: SettingsSchema,
});
