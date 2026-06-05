import { z } from "zod";
import { ServiceCategorySchema } from "./service.schema";
import { BlogPostSchema } from "./blog.schema";
import { TagSchema } from "./tag.schema";
// import { LevelSchema, DeadlineSchema } from "./common.schema";

export const SampleSchema = z.object({
  id:         z.string().min(1, "Sample id is required"),
  title:      z.string().min(1, "Sample title is required"),
  slug:       z.string().min(1, "Sample slug is required"),
  excerpt:    z.string().nullable().default(""),
  service_id: z.string().nullable().default(""),
  word_count: z.number().int().nonnegative().default(0),
  featured:   z.boolean().default(false),
  image:      z.string().nullable().default(""),
  tags:       z.array(TagSchema).optional().default([]),
}).passthrough();

export const FeaturedContentResponseSchema = z.object({
  services: z.array(ServiceCategorySchema),
  samples:  z.array(SampleSchema),
  blogs:    z.array(BlogPostSchema),
});