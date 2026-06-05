"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { SampleCard } from "./SampleCard";
import type {
  FeaturedSamplesProps,
} from "../_props";
import type { Sample } from "../_types";
import { toSampleViewModels } from "../_mappers";
import { FALLBACK_SAMPLES } from "../_fallback/featured.fallback";

function EmptySamples() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <span className="text-5xl mb-4" aria-hidden="true">📂</span>
      <p className="text-base font-medium">No samples available yet.</p>
      <p className="text-sm mt-1">Our team is preparing quality examples — check back soon.</p>
    </div>
  );
}


export function FeaturedSamples({
  samples,
  title       = "Sample Work",
  description = "Browse a selection of real work produced by our expert writers and editors. Every sample reflects the quality and depth we bring to every order.",
  className,
}: FeaturedSamplesProps) {
  const source: readonly Sample[] =
    samples.length > 0 ? samples : FALLBACK_SAMPLES;

  const viewModels = toSampleViewModels(source);

  const sorted = [...viewModels].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return b.wordCount - a.wordCount;
  });

  return (
    <section
      aria-labelledby="featured-samples-heading"
      className={cn(
        "relative w-full bg-white py-16 md:py-20 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-slate-100" aria-hidden="true" />

      <div className="mx-auto max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeader
          id="featured-samples-heading"
          title={title}
          description={description}
          backgroundLabel="SAMPLES"
          backgroundPosition="left"
          align="center"
          accentWord="Sample"
        />

        {sorted.length === 0 ? (
          <EmptySamples />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.slice(0, 6).map((sample) => (
              <SampleCard key={sample.id} sample={sample} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/samples"
            className={cn(
              "inline-flex items-center gap-2 rounded-full",
              "bg-emerald-500 px-6 py-3 text-sm font-semibold text-white",
              "transition-colors duration-200 hover:bg-emerald-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 shadow-none"
            )}
          >
            Browse all samples
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}