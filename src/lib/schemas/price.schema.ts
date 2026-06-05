import { z } from "zod";
import { isoUtcDatetime } from "@/lib/utils"
import { DeadlineSchema } from "./common.schema";

export const PricingCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional().default(""),
  display_order: z.number().int().nonnegative().default(0),
}).passthrough();

export const CalculatePriceResponseSchema = z.object({
  price_per_page: z.number().nonnegative(),
  page_count: z.number().min(1),
  pages_price: z.number().nonnegative(),
  total_price: z.number().nonnegative(),
  deadline_hours: z.number().positive(),
  selected_deadline: DeadlineSchema,
});

export const CalculatePriceRequestSchema = z.object({
  service_id: z.string().min(1, "Service is required"),
  level_id: z.string().min(1, "Level is required"),
  deadline: isoUtcDatetime,
  page_count: z.number().int().min(1, "Page count must be at least 1"),
  word_count: z.number().int().positive(),
});