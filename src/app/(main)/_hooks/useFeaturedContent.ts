"use client";

import { useMemo } from "react";
import { FeaturedContentSeed, UseFeaturedContentReturn } from "../_types/featured.types";
import {
  toBlogPostViewModels,
  toSampleViewModels,
} from "../_mappers";

export function useFeaturedContent(
  seed: FeaturedContentSeed
): UseFeaturedContentReturn {
  const blogPosts = useMemo(
    () =>
      toBlogPostViewModels(seed.blogs).sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return (
          new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
        );
      }),
    [seed.blogs]
  );

  const featuredBlogs = useMemo(
    () => blogPosts.filter((p) => p.isFeatured),
    [blogPosts]
  );

  const samples = useMemo(
    () => toSampleViewModels(seed.samples),
    [seed.samples]
  );

  const featuredSamples = useMemo(
    () => samples.filter((s) => s.isFeatured),
    [samples]
  );

  return {
    blogPosts,
    featuredBlogs,
    samples,
    featuredSamples,
    services:    seed.services,
    hasBlogs:    blogPosts.length > 0,
    hasSamples:  samples.length > 0,
  };
}
