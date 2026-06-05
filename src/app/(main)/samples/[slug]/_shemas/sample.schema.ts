import { z } from "zod";

export const SampleTagSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((v) => String(v)),
  name: z.string(),
  slug: z.string(),
  usage_count: z.number().default(0),
});

export const SampleServiceSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((v) => String(v)),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const SampleSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((v) => String(v)),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().nullable().default(""),
  service_id: z
    .union([z.string(), z.number(), z.null()])
    .transform((v) => v ? String(v) : ""),
  word_count: z.number().min(0).default(0),
  featured: z.boolean().default(false),
  image: z.string().nullable().default(""),
  tags: z.array(SampleTagSchema).default([]),
  service: SampleServiceSchema.nullable().optional(),
}).passthrough();

export const RelatedSamplesResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z
        .union([z.string(), z.number()])
        .transform((v) => String(v)),
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().default(""),
      service_id: z
        .union([z.string(), z.number()])
        .transform((v) => String(v)),
      word_count: z.number().min(0).default(0),
      featured: z.boolean().default(false),
      image: z.string().default(""),
      tags: z.array(SampleTagSchema).default([]),
      service: SampleServiceSchema,
    })
  ),
});

export type ValidatedSample        = z.infer<typeof SampleSchema>;
export type ValidatedSampleService = z.infer<typeof SampleServiceSchema>;
export type ValidatedSampleTag     = z.infer<typeof SampleTagSchema>;