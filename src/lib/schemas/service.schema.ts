import { z } from "zod";
import { TagSchema } from "./tag.schema";
import { SampleListItemSchema } from "./samples.schema";
import { PricingCategorySchema } from "./price.schema";

export const ServiceSchema = z.object({
  id:                  z.string().min(1),
  name:                z.string().min(1),
  description:         z.string().nullable().optional().default(""),
  category_id:         z.string().nullable().optional().default(""),
  featured:            z.boolean().default(false),
  pricing_category_id: z.string().or(z.number()).nullable().optional().transform(v => v ? String(v) : ""),
  slug:                z.string().min(1),
  is_active:           z.boolean().default(true),
  tags:                z.array(TagSchema).optional().default([]),
}).passthrough();

export const ServiceCategorySchema = z.object({
  id:          z.string().min(1),
  name:        z.string().min(1),
  description: z.string().nullable().optional().default(""),
  order:       z.number().int().nullable().optional().default(0),
  services:    z.array(ServiceSchema).optional(),
}).passthrough();

export const ServiceDetailsSchema = ServiceSchema.extend({
  pricing_category: PricingCategorySchema,
  category: ServiceCategorySchema,
}).passthrough();

export const RelatedContentResponseSchema = z.object({
  services: z.array(ServiceSchema),
  samples:  z.array(SampleListItemSchema),
});

export const AcademicLevelSchema = z.object({
  id:    z.string().min(1),
  name:  z.string().min(1),
  order: z.number().int().nullable().optional().default(0),
}).passthrough();

export const GetServicesResponseSchema = z.object({
  services: z.array(ServiceSchema),
});
